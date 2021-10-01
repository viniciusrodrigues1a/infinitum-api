import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
} from "@modules/project/use-cases";

export interface IUseCaseFactory {
  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase;
  makeCreateProjectUseCase(language: ILanguage): CreateProjectUseCase;
  makeDeleteProjectUseCase(language: ILanguage): DeleteProjectUseCase;
}
