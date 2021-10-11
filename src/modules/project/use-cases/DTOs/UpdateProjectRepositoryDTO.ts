import { UpdateProjectUseCaseDTO } from "./UpdateProjectUseCaseDTO";

export type UpdateProjectRepositoryDTO = Omit<
  UpdateProjectUseCaseDTO,
  "accountEmailMakingRequest"
>;
