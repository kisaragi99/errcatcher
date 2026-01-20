import { ErrorListQueryParams, useErrorLogic } from '../../entities/error/api/useErrorLogic';
import ErrorTable, { ColumnDef } from '../../features/ErrorsTable/ErrorsTable';
import { useProjectLogic } from '../../entities/project/api/useProjectLogic';
import { useMemo } from 'react';
import { ErrorsListData } from '../../_generated_/api';
import { ErrorTableFilterPane } from '../../features/ErrorsTable/ErrorsTableFIlterPane/ErrorsTableFilterPane';
import { useErrorTableFilters } from '../../features/ErrorsTable/ErrorsTableFIlterPane/useErrorsTableFilters';
import { LoadingBar } from '../../shared/ui/LoadingBar/LoadingBar';
import { Box, Typography } from '@mui/material';

export type DefinedErrorListQueryParams = Exclude<ErrorListQueryParams, undefined>;
export type ErrorItem = NonNullable<ErrorsListData['data']>[number];

const ErrorsPage = () => {
  const filterLogic = useErrorTableFilters();

  const { errorsListQuery } = useErrorLogic({
    errorsListQueryParams: {
      limit: filterLogic.pagination.limit,
      page: filterLogic.pagination.currentPage,
      project_id: filterLogic?.filters?.selectedProject,
      error_message: filterLogic?.filters?.searchText,
      start_date: filterLogic.filters.startDate?.toISOString(),
      end_date: filterLogic.filters.endDate?.toISOString()
    }
  });

  const { projectsFilterOptionsQuery } = useProjectLogic({
    enableFilterOptionsQuery: true
  });

  const projectsNames = useMemo(() => {
    const projectsNamesMap: Record<string, string> = {};

    (projectsFilterOptionsQuery.data?.data || []).forEach((el) => {
      projectsNamesMap[el.id!] = el.name;
    });

    return projectsNamesMap;
  }, [projectsFilterOptionsQuery.data?.data]);

  const columns: ColumnDef<ErrorItem>[] = [
    {
      id: 'project_id',
      label: 'Project',
      render: (_, row) => {
        return <span>{projectsNames?.[row?.project_id] || row?.project_id}</span>;
      },
    },
    {
      id: 'error_message',
      label: 'Error Message',
      showTooltip: true
    },
    {
      id: 'created_at',
      label: 'Created At',
      sortable: true,
      render: (_, row) => (
        new Date(row.created_at as string).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }))
    }
  ];

  const isLoading = errorsListQuery.isFetching || projectsFilterOptionsQuery.isFetching;

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <ErrorTableFilterPane
        filterLogic={filterLogic}
        selectOptions={projectsFilterOptionsQuery?.data?.data?.map((el) => ({
          value: el.id,
          label: el.name
        })) || []}
      />
      {isLoading ? null : !errorsListQuery.data?.data?.data?.length ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 200,
          backgroundColor: '#fff',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Typography variant="h6" color="text.secondary">
            No errors found
          </Typography>
        </Box>
      ) : (
        <ErrorTable
          getRowId={(row) => row.id}
          loading={false}
          setErrorListQueryParams={() => {}}
          columns={columns}
          data={errorsListQuery.data?.data?.data || []}
          pagination={filterLogic.pagination}
        />
      )}
    </>
  );
};

export default ErrorsPage;
