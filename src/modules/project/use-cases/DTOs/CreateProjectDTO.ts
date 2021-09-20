import { ProjectDTO } from "@modules/project/entities/DTOs";
import { AccountMakingRequestDTO } from "@shared/use-cases/DTOs";

export type CreateProjectDTO = ProjectDTO & AccountMakingRequestDTO;
