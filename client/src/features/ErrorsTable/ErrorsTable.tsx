import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Tooltip,
  Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import SimplePagination from '../../shared/ui/SimplePagination/SimplePagination';
import { ErrorListQueryParams } from '../../entities/error/api/useErrorLogic';
import { usePagination } from '../../shared/hooks/usePagination';
import CustomFieldsContent from '../../shared/ui/CustomFieldsContent/CustomFieldsContent';

export type ColumnDef<T, SC extends string = string> = {
  id: keyof T | "actions";
  label: string;
  sortable?: Extract<keyof T, SC> extends never ? never : boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  showTooltip?: boolean;
};


export interface ErrorTableProps<T, SC extends string = string> {
  columns: ColumnDef<T, SC>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Optional renderer for expanded details for a row */
  renderDetail?: (row: T) => React.ReactNode;
  loading: boolean;
  setErrorListQueryParams: React.Dispatch<React.SetStateAction<ErrorListQueryParams>>
  pagination: ReturnType<typeof usePagination>
}

const baseCellStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const columnStyles = {
  project_id: {
    ...baseCellStyle,
  },
  error_message: {
    ...baseCellStyle,
    maxWidth: 0,
    width: '100%',
  },
  created_at: {
    ...baseCellStyle,
  },
  default: baseCellStyle,
};

const getCellStyle = (columnId: string) => {
  return columnStyles[columnId as keyof typeof columnStyles] || columnStyles.default;
};

const ErrorTable = <T, SC extends string = string>(props: ErrorTableProps<T, SC>) => {
  const [openedRowIds, setOpenesRowIds] = useState<string[]>([]);

  const onRowOpen = (rowId: string) => {
    setOpenesRowIds((prevState) => {
      if(prevState.includes(rowId)){
        return [...prevState.filter((el) => el !== rowId)]
      }

      return [...prevState, rowId]
    })
  }
 
  return (
    <TableContainer component={Paper}>
      <Table aria-label="generic table" size="small">
        <TableHead>
          <TableRow>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {props.data.some((row) => props.renderDetail || (row as any)?.custom_fields) ? (
              <TableCell sx={baseCellStyle} />
            ): null}
            {props.columns.map((column) => (
              <TableCell
                key={String(column.id)}
                sx={getCellStyle(String(column.id))}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.data.map((row) => {
            const rowId = props.getRowId(row);

            const detailContent = props.renderDetail
              ? props.renderDetail(row)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              : (row as any)?.custom_fields
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? <CustomFieldsContent data={(row as any)?.custom_fields} />
              : null;

            const hasDetail = Boolean(detailContent);

            return (
              <React.Fragment key={rowId}>
                <TableRow>
                  {hasDetail ? (
                    <TableCell sx={baseCellStyle}>
                      <IconButton size="small" onClick={() => onRowOpen(rowId)}>
                        {openedRowIds.includes(rowId) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  ): null}

                  {props.columns.map((column) => {
                    const cellStyle = getCellStyle(String(column.id));
                    const cellContent = column.render
                      ? column.render(row[column.id as keyof T], row)
                      : String(row[column.id as keyof T]);

                    if (column.showTooltip) {
                      return (
                        <Tooltip title={String(row[column.id as keyof T])} key={String(column.id)}>
                          <TableCell sx={cellStyle}>
                            {cellContent}
                          </TableCell>
                        </Tooltip>
                      );
                    } else {
                      return (
                        <TableCell sx={cellStyle} key={String(column.id)}>
                          {cellContent}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>

                {hasDetail ? (
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={props.columns.length + 1}
                    >
                      <Collapse in={openedRowIds.includes(rowId)} timeout="auto" unmountOnExit>
                        <Box margin={1}>{detailContent}</Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                ): null}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <SimplePagination
        limit={props.pagination.limit}
        hasPrevious={props.pagination.hasPrevious}
        hasNext={props.data?.length === props.pagination.limit}
        onNext={props.pagination.next}
        onPrevious={props.pagination.previous}
        onLimitChange={props.pagination.changeLimit}
      />
    </TableContainer>
  );
};

export default ErrorTable;
