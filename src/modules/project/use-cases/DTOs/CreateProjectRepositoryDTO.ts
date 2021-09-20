import { ProjectDTO } from "@modules/project/entities/DTOs";

export type CreateProjectRepositoryDTO = ProjectDTO & {
  projectId: string;
  ownerEmail: string;
};
