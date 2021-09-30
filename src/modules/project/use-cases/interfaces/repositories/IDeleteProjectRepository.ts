import { DeleteProjectDTO } from "../../DTOs/DeleteProjectDTO";

export interface IDeleteProjectRepository {
  deleteProject(
    data: Omit<DeleteProjectDTO, "accountEmailMakingRequest">
  ): Promise<void>;
}
