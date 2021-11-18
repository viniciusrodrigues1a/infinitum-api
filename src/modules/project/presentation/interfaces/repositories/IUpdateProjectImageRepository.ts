export type UpdateProjectImageRepositoryDTO = {
  file: any;
  projectId: string;
};

export interface IUpdateProjectImageRepository {
  updateProjectImage(data: UpdateProjectImageRepositoryDTO): Promise<void>;
}
