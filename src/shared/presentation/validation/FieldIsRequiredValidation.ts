import { MissingParamsError } from "@shared/presentation/errors";
import { IMissingParamsErrorLanguage } from "@shared/presentation/interfaces/languages";
import { IValidation } from "./IValidation";

export class FieldIsRequiredValidation implements IValidation {
  constructor(
    private readonly accessor: string,
    private readonly fieldNameI18N: string,
    private readonly language: IMissingParamsErrorLanguage
  ) {}

  validate(input: any): Error | void {
    if (!input[this.accessor]) {
      return new MissingParamsError([this.fieldNameI18N], this.language);
    }
  }
}
