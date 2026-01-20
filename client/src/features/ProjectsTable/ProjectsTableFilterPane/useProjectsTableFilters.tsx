import { useState } from "react";
import { usePagination } from "../../../shared/hooks/usePagination";
import { FilterState } from "./ProjectsTableFilterPane";

export const useProjectsTableFilters = (initialState?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedProject: undefined,
    ...initialState,
  });
  const [resetKey, setResetKey] = useState(0);
  const pagination = usePagination();

  const handleSelectChange = (selectedProject?: string) => {
    setFilters(prev => ({ ...prev, selectedProject }));
  };

  const resetFilters = () => {
    setFilters({
      selectedProject: undefined,
    });
    
    pagination.setCurrentPage(1);
    pagination.changeLimit(10);
    setResetKey((prev) => prev + 1);
  };

  return {
    filters,
    handleSelectChange,
    resetFilters,
    resetKey,
    pagination
  };
};