import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { axiosServiceInstance } from "../../../app/services/axios-service";
import { formatError } from "../../../shared/utils/format-error";

export type ProjectsListQueryParams = Parameters<typeof axiosServiceInstance.generatedAxios.api.projectsList>[0];
export type ProjectsCreateBody = Parameters<typeof axiosServiceInstance.generatedAxios.api.projectsCreate>[0];
export type ProjectsUpdateParams = Parameters<typeof axiosServiceInstance.generatedAxios.api.projectsUpdate>


export type ProjectLogicProps = {
  projectQueryKey?: string;
  projectsListQueryKey?: string;
  selectedProjectId?: string;
  projectListQueryParams?: ProjectsListQueryParams;
  enableTableQuery?: boolean;
  enableFilterOptionsQuery?: boolean;
};

export const useProjectLogic = (props: ProjectLogicProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const projectQuery = useQuery({
    queryKey: ['projectQuery', props.projectQueryKey, props.selectedProjectId],
    queryFn: () => axiosServiceInstance.generatedAxios.api.projectsDetail(props.selectedProjectId!),
    enabled: !!props.selectedProjectId,
  });

  const projectsTableQuery = useQuery({
    queryKey: ['projectsTableQuery', props.projectsListQueryKey, props.projectListQueryParams],
    queryFn: () => {
      const { page, limit, id, start_date, end_date } = props.projectListQueryParams || {};
      return axiosServiceInstance.generatedAxios.api.projectsList({
        page,
        limit,
        id,
        start_date,
        end_date
      });
    },
    enabled: props.enableTableQuery !== false,
    placeholderData: (previousData) => previousData,
  });

  const projectsFilterOptionsQuery = useQuery({
    queryKey: ['projectsFilterOptionsQuery'],
    queryFn: () => axiosServiceInstance.generatedAxios.api.projectsList(),
    enabled: props.enableFilterOptionsQuery !== false,
  });

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: axiosServiceInstance.generatedAxios.api.projectsCreate,
    onSuccess: () => {
      enqueueSnackbar('Project created successfully!', { variant: 'success', autoHideDuration: 5000 });
      queryClient.invalidateQueries({ queryKey: ['projectsFilterOptionsQuery'] }),
      queryClient.invalidateQueries({ queryKey: ['projectsTableQuery'] })
    },
    onError: (error) => {
      enqueueSnackbar(formatError(error), { variant: 'error', autoHideDuration: 5000 });
    }
  });

  const createProject = (body: ProjectsCreateBody ) => {
    return createProjectMutation.mutateAsync(body);
  };

  return {
    projectQuery,
    projectsTableQuery,
    projectsFilterOptionsQuery,
    createProjectMutation,
    createProject,
  };
};
