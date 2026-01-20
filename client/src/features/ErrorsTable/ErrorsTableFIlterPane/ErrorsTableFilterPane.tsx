import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,
  TextField,
  FormControl,
  Grid,
  Autocomplete,
  Button,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals/models';
import { useErrorTableFilters } from './useErrorsTableFilters';

// Define types for our filter state
export interface FilterState {
  selectedProject?: string;
  searchText?: string;
  startDate: PickerValue | undefined;
  endDate: PickerValue | undefined;
}

interface ErrorTableFilterPaneProps {
  filterLogic: ReturnType<typeof useErrorTableFilters>;
  selectOptions: { value: string; label: string }[];
}

export const ErrorTableFilterPane = ({ filterLogic, selectOptions }: ErrorTableFilterPaneProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    handleSelectChange,
    handleSearchChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,
    resetKey
  } = filterLogic;

  return (
    <Box sx={{ p: 0, mb: 2 }}>
      <Grid
        container
        spacing={2}
        key={resetKey}

      >
        <FormControl sx={{ width: isMobile ? '100%' : 300 }}>
          <Autocomplete
            id="project-multiselect-id"
            size="small"
            options={selectOptions}
            getOptionLabel={(option) => option.label}
            onChange={(_event, value) => {
              handleSelectChange(value?.value ?? undefined)
            }}
            renderInput={(params) => (
              <TextField {...params} label="Project"/>
            )}
          />
        </FormControl>

        <TextField 
          sx={{ width: isMobile ? '100%' : 300 }} 
          size="small" 
          label="Search by Error Message" 
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      
        <DateTimePicker
          sx={{ width: isMobile ? '100%' : 300 }}
          label="Error Start Date"
          onChange={handleStartDateChange}
          format='DD-MM-YYYY'
          slotProps={{ 
            textField: { 
              size: 'small',
              fullWidth: true
            } 
          }}
        />
        <DateTimePicker
          sx={{ width: isMobile ? '100%' : 300 }}
          label="Error End Date"
          onChange={handleEndDateChange}
          format='DD-MM-YYYY'
          slotProps={{ 
            textField: { 
              size: 'small',
              fullWidth: true
            } 
          }}
        />

        <Button
          onClick={resetFilters}
          variant="outlined"
        >
          Reset
        </Button>
      </Grid>
    </Box>
  );
};