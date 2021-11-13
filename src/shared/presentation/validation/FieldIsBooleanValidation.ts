import { InvalidParamError } from "../errors";
import { IInvalidParamErrorLanguage } from "../interfaces/languages";
import { IValidation } from "./IValidation";

export class FieldIsBooleanValidation implements IValidation {
  constructor(
    private readonly accessor: string,
    private readonly fieldNameI18N: string,
    private readonly language: IInvalidParamErrorLanguage
  ) {}

  validate(input: any): Error | void {
    if (input[this.accessor] && typeof input[this.accessor] !== "boolean") {
      return new InvalidParamError(this.fieldNameI18N, this.language);
    }
  }
}
