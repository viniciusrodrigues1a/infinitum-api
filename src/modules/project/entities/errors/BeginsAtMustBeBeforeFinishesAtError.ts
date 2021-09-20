import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "../interfaces/languages";

export class BeginsAtMustBeBeforeFinishesAtError extends Error {
  constructor(language: IBeginsAtMustBeBeforeFinishesAtErrorLanguage) {
    const message = language.getBeginsAtMustBeBeforeFinishesAtErrorMessage();
    super(message);
    this.message = message;
  }
}
