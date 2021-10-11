import { IMissingParamsErrorLanguage } from "@shared/presentation/interfaces/languages";

export interface IUpdateProjectControllerLanguage
  extends IMissingParamsErrorLanguage {
  getMissingParamsErrorNameParamMessage(): string;
  getMissingParamsErrorDescriptionParamMessage(): string;
}
