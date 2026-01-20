import { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

export type SortDirection = 'asc' | 'desc' | undefined;

export interface SortLabelProps<T extends string> {
  field: T;
  label: string;
  onChange: (sort: { field: T; sort_direction: SortDirection }) => void;
}

const iconStyles = { width: '24px', height: '24px' };

const SortLabel = <T extends string>({ field, label, onChange }: SortLabelProps<T>) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);

  const handleClick = () => {
    const newSortDirection: SortDirection =
      sortDirection === undefined ? 'asc' : sortDirection === 'asc' ? 'desc' : undefined;

    setSortDirection(newSortDirection);
    onChange({ field, sort_direction: newSortDirection });
  };

  return (
    <IconButton disableRipple onClick={handleClick} size="small" sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" component="span" sx={{ marginRight: 1 }}>
        {label}
      </Typography>
      {sortDirection === 'asc' ? (
        <KeyboardArrowUp sx={iconStyles} />
      ) : sortDirection === 'desc' ? (
        <KeyboardArrowDown sx={iconStyles} />
      ) : (
        <span style={iconStyles} />
      )}
    </IconButton>
  );
};

export default SortLabel;
