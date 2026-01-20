import { useState, useCallback } from 'react';

export const usePagination = (initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const hasPrevious = currentPage > 1;

  const next = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const previous = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    limit,
    hasPrevious,
    next,
    previous,
    changeLimit,
    resetPage,
    setCurrentPage
  };
};