import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import { ILanguage } from "main/adapters/utils";

export interface IUseCaseFactory {
  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase;
}
