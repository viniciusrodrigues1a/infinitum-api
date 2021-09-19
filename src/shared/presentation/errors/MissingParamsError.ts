import { IMissingParamsErrorLanguage } from "../interfaces/languages";

export class MissingParamsError extends Error {
  params: string[];

  constructor(params: string[], language: IMissingParamsErrorLanguage) {
    const message = language.getMissingParamsErrorMessage(params);
    super(message);
    this.message = message;
    this.params = params;
  }
}
