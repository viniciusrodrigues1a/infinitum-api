import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type DeleteProjectDTO = AccountMakingRequestDTO & {
  projectId: string;
};
