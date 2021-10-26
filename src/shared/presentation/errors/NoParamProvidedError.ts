import { INoParamProvidedErrorLanguage } from "../interfaces/languages";

export class NoParamProvidedError extends Error {
  constructor(language: INoParamProvidedErrorLanguage) {
    const message = language.getNoParamProvidedErrorMessage();
    super(message);
    this.message = message;
  }
}
