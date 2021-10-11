import { ProjectDTO } from "@modules/project/entities/DTOs";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type UpdateProjectUseCaseDTO = AccountMakingRequestDTO &
  Partial<
    Pick<ProjectDTO, "name" | "description" | "beginsAt" | "finishesAt">
  > & {
    projectId: string;
  };
