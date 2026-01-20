import { PickerValue } from "@mui/x-date-pickers/internals";
import { useState } from "react";
import { FilterState } from "./ErrorsTableFilterPane";
import { useDebouncedCallback } from 'use-debounce';
import { usePagination } from "../../../shared/hooks/usePagination";

export const useErrorTableFilters = (initialState?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedProject: undefined,
    searchText: undefined,
    startDate: null,
    endDate: null,
    ...initialState,
  });
  const [resetKey, setResetKey] = useState(0);
  const pagination = usePagination();

  const debouncedSetStartDate = useDebouncedCallback(
    (date: PickerValue | undefined) => {
      pagination.setCurrentPage(1);
      setFilters(prev => ({ ...prev, startDate: date }));
    },
    500
  );

  const debouncedSetEndDate = useDebouncedCallback(
    (date: PickerValue | undefined) => {
      pagination.setCurrentPage(1);
      setFilters(prev => ({ ...prev, endDate: date }));
    },
    500
  );

  const handleSelectChange = (selectedProject?: string) => {
    pagination.setCurrentPage(1);
    setFilters(prev => ({ ...prev, selectedProject }));
  };

  const debouncedSetSearchText = useDebouncedCallback(
    (searchText: string | undefined) => {
      pagination.setCurrentPage(1);
      setFilters(prev => ({ ...prev, searchText }));
    }, 
    500
  );

  const handleSearchChange = (searchText?: string) => {
    debouncedSetSearchText(searchText);
  };

  const handleStartDateChange = (date: PickerValue | undefined) => {
    debouncedSetStartDate(date);
  };

  const handleEndDateChange = (date: PickerValue | undefined) => {
    debouncedSetEndDate(date);
  };

  const resetFilters = () => {
    setFilters({
      selectedProject: undefined,
      searchText: undefined,
      startDate: null,
      endDate: null,
    });

    debouncedSetSearchText.cancel();
    debouncedSetStartDate.cancel();
    debouncedSetEndDate.cancel();

    pagination.setCurrentPage(1)
    pagination.changeLimit(10);

    setResetKey((prev) => prev + 1);
  };

  return {
    filters,
    handleSelectChange,
    handleSearchChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,
    resetKey,
    pagination
  };
};