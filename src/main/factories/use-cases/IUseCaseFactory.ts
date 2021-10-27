import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import { CreateIssueUseCase } from "@modules/issue/use-cases";
import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteProjectUseCase,
  ListProjectsOwnedByAccountUseCase,
  UpdateProjectUseCase,
} from "@modules/project/use-cases";

export interface IUseCaseFactory {
  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase;
  makeCreateProjectUseCase(language: ILanguage): CreateProjectUseCase;
  makeDeleteProjectUseCase(language: ILanguage): DeleteProjectUseCase;
  makeUpdateProjectUseCase(language: ILanguage): UpdateProjectUseCase;
  makeListProjectsOwnedByAccountUseCase(): ListProjectsOwnedByAccountUseCase;
  makeCreateIssueGroupForProjectUseCase(
    language: ILanguage
  ): CreateIssueGroupForProjectUseCase;
  makeCreateIssueUseCase(language: ILanguage): CreateIssueUseCase;
  makeDeleteIssueUseCase(language: ILanguage): DeleteIssueUseCase;
}
