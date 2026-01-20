import { Box, IconButton, MenuItem, Select } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

interface PagePaginationProps {
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onLimitChange: (newLimit: number) => void;
}

const SimplePagination = ({
  limit,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  onLimitChange,
}: PagePaginationProps) => {
  return (
    <Box display="flex" alignItems="center" gap={2} padding={2}>
      <Select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        size="small"
      >
        {[10, 50, 100].map((option) => (
          <MenuItem key={option} value={option}>
            {option} per page
          </MenuItem>
        ))}
      </Select>

      <IconButton
        onClick={onPrevious}
        disabled={!hasPrevious}
        style={{
          border: '1px solid #ccc',
          borderRadius: 5,
        }}
        size="medium"
        aria-label="Previous page"
      >
        <ArrowLeft />
      </IconButton>
      
      <IconButton
        onClick={onNext}
        disabled={!hasNext}
        style={{
          border: '1px solid #ccc',
          borderRadius: 5,
        }}
        size="medium"
        aria-label="Next page"
      >
        <ArrowRight />
      </IconButton>
    </Box>
  );
};

export default SimplePagination;