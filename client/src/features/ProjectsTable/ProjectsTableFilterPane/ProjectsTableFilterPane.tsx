import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,
  FormControl,
  Grid,
  Autocomplete,
  Button,
  TextField,
} from '@mui/material';
import { useProjectsTableFilters } from './useProjectsTableFilters';

export interface FilterState {
  selectedProject?: string;
}

interface ProjectsTableFilterPaneProps {
  filterLogic: ReturnType<typeof useProjectsTableFilters>;
  selectOptions: { value: string; label: string }[];
  onOpenCreateModal: () => void;
}

export const ProjectsTableFilterPane = ({ 
  filterLogic, 
  selectOptions, 
  onOpenCreateModal 
}: ProjectsTableFilterPaneProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    handleSelectChange,
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
            size="small"
            id="project-multiselect-id"
            options={selectOptions}
            getOptionLabel={(option) => option.label}
            onChange={(_event, value) => {
              handleSelectChange(value?.value ?? undefined);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Project" />
            )}
          />
        </FormControl>
        
        <Button
          variant="outlined"
          onClick={resetFilters}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onOpenCreateModal}
          size="small"
        >
          Create Project
        </Button>
      </Grid>
    </Box>
  );
};