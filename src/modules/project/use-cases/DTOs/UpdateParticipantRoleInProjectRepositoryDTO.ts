import { UpdateParticipantRoleInProjectUseCaseDTO } from "./UpdateParticipantRoleInProjectUseCaseDTO";

export type UpdateParticipantRoleInProjectRepositoryDTO = Omit<
  UpdateParticipantRoleInProjectUseCaseDTO,
  "accountEmailMakingRequest"
>;
