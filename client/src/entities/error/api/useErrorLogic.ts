import { useQuery, useMutation } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { axiosServiceInstance } from "../../../app/services/axios-service";
import { formatError } from "../../../shared/utils/format-error";


export type CreateErrorBody = Parameters<typeof axiosServiceInstance.generatedAxios.api.errorsCreate>[0]
export type ErrorListQueryParams = Parameters<typeof axiosServiceInstance.generatedAxios.api.errorsList>[0];

export type ErrorLogicProps = {
  errorsListQueryKey?: string;
  errorQueryKey?: string;
  errorsListQueryParams?: ErrorListQueryParams;
  selectedErrorId?: string;
};

export const useErrorLogic = (props: ErrorLogicProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const errorsListQuery = useQuery({
    queryKey: ['errorsListQuery', props.errorsListQueryKey, props.errorsListQueryParams],
    queryFn: () =>
      axiosServiceInstance.generatedAxios.api.errorsList(props.errorsListQueryParams),
    placeholderData: (previousData) => previousData,
  });

  const createErrorMutation = useMutation({
    mutationFn: axiosServiceInstance.generatedAxios.api.errorsCreate,
    onSuccess: () => {
      enqueueSnackbar('Error logged successfully!', { variant: 'success', autoHideDuration: 5000 });
    },
    onError: (error) => {
      enqueueSnackbar(formatError(error), { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const createError = (body: CreateErrorBody) => { createErrorMutation.mutate(body) };

  return {
    errorsListQuery,
    createErrorMutation,
    createError,
  };
};
