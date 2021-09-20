import { CreateProjectRepositoryDTO } from "../../DTOs";

export interface ICreateProjectRepository {
  createProject(data: CreateProjectRepositoryDTO): Promise<void>;
}
