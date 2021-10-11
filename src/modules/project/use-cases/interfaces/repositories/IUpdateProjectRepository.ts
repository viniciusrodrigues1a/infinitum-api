import { UpdateProjectRepositoryDTO } from "@modules/project/use-cases/DTOs";

export interface IUpdateProjectRepository {
  updateProject(data: UpdateProjectRepositoryDTO): Promise<void>;
}
