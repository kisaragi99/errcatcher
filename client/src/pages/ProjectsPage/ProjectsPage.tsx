import { ErrorListQueryParams } from '../../entities/error/api/useErrorLogic';
import { useProjectLogic } from '../../entities/project/api/useProjectLogic';
import { ProjectsListData } from '../../_generated_/api';
import ProjectsTable, { ColumnDef } from '../../features/ProjectsTable/ProjectsTable';
import { useErrorTableFilters } from '../../features/ErrorsTable/ErrorsTableFIlterPane/useErrorsTableFilters';
import { ProjectsTableFilterPane } from '../../features/ProjectsTable/ProjectsTableFilterPane/ProjectsTableFilterPane';
import { CreateProjectModal } from '../../features/ProjectsTable/CreateProjectModal/CreateProjectModal';
import { LoadingBar } from '../../shared/ui/LoadingBar/LoadingBar';
import { useState } from 'react';

export type DefinedErrorListQueryParams = Exclude<ErrorListQueryParams, undefined>;
export type ErrorItem = NonNullable<ProjectsListData>[number];

const ErrorsPage = () => {
  const filterLogic = useErrorTableFilters();
  const { projectsTableQuery, projectsFilterOptionsQuery } = useProjectLogic({
    projectListQueryParams: {
      limit: filterLogic.pagination.limit,
      page: filterLogic.pagination.currentPage,
      id: filterLogic.filters.selectedProject
    },
    enableTableQuery: true,
    enableFilterOptionsQuery: true
  });

  const columns: ColumnDef<ErrorItem>[] = [
    {
      id: 'name',
      label: 'Project',
    },
    {
      id: 'id',
      label: 'id',
    },
    {
      id: 'description',
      label: 'Description',
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


  const isLoading = projectsTableQuery.isFetching || projectsFilterOptionsQuery.isFetching;
  const showTable = projectsFilterOptionsQuery.data?.data?.length && projectsTableQuery.data?.data?.length;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createProject, createProjectMutation } = useProjectLogic({});

  const handleCreateProject = async (data: { name: string; description?: string; custom_fields?: object }) => {
    return createProject({
      name: data.name,
      description: data.description || undefined,
      custom_fields: data.custom_fields || undefined,
    }).then(() => {
      setIsCreateModalOpen(false);
    })
  };

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <ProjectsTableFilterPane
        filterLogic={filterLogic}
        selectOptions={projectsFilterOptionsQuery?.data?.data?.map((project) => ({
          value: project.id,
          label: project.name
        })) || []}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
      {showTable ? 
        <ProjectsTable
          getRowId={(row) => row.id}
          setErrorListQueryParams={() => {}}
          columns={columns}
          data={projectsTableQuery.data?.data || []}
          pagination={filterLogic.pagination}
        />
      : null}

      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
        loading={createProjectMutation.isPending}
      />
    </>
  );
};

export default ErrorsPage;
