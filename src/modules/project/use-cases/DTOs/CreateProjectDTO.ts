import { ProjectDTO } from "@modules/project/entities/DTOs";

export type CreateProjectDTO = ProjectDTO & {
  accountEmailRequestingCreation: string;
};
