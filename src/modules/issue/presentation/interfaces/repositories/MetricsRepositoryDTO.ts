import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type MetricsRepositoryDTO = AccountMakingRequestDTO & {
  date: string;
};
