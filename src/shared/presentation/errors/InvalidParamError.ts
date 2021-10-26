import { IInvalidParamErrorLanguage } from "../interfaces/languages";

export class InvalidParamError extends Error {
  constructor(param: string, language: IInvalidParamErrorLanguage) {
    const message = language.getInvalidParamErrorMessage(param);
    super(message);
    this.message = message;
  }
}
