import { NotFutureDateError } from "../errors";
import { INotFutureDateErrorLanguage } from "../interfaces/languages";

export class FutureDate {
  value: Date;

  constructor(date: Date, language: INotFutureDateErrorLanguage) {
    if (!this.isDateValid(date)) {
      throw new NotFutureDateError(date, language);
    }

    this.value = date;
    Object.freeze(this);
  }

  private isDateValid(date: Date): boolean {
    const now = new Date().getTime();
    const difference = now - date.getTime();

    return difference < 0;
  }
}
