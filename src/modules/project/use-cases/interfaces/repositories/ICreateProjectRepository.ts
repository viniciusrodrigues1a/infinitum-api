import { CreateProjectDTO } from "../../DTOs";

export interface ICreateProjectRepository {
  createProject(data: CreateProjectDTO): Promise<void>;
}
