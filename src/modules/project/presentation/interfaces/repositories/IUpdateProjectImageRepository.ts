export type UpdateProjectImageRepositoryDTO = {
  fileBuffer: Buffer;
  projectId: string;
};

export interface IUpdateProjectImageRepository {
  updateProjectImage(data: UpdateProjectImageRepositoryDTO): Promise<void>;
}
