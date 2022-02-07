import { InvalidParamError } from "@shared/presentation/errors";
import { IInvalidParamErrorLanguage } from "@shared/presentation/interfaces/languages";
import { IValidation } from "./IValidation";

export class FieldIsStringValidation implements IValidation {
  constructor(
    private readonly accessor: string,
    private readonly fieldNameI18N: string,
    private readonly language: IInvalidParamErrorLanguage
  ) {}

  validate(input: any): Error | void {
    if (input[this.accessor] === "") {
      return new InvalidParamError(this.fieldNameI18N, this.language);
    }

    if (input[this.accessor] && typeof input[this.accessor] !== "string") {
      return new InvalidParamError(this.fieldNameI18N, this.language);
    }
  }
}
