import { InvalidParamError } from "@shared/presentation/errors";
import { IInvalidParamErrorLanguage } from "@shared/presentation/interfaces/languages";
import { IValidation } from "./IValidation";

export class FieldIsDateValidation implements IValidation {
  constructor(
    private readonly accessor: string,
    private readonly fieldNameI18N: string,
    private readonly language: IInvalidParamErrorLanguage
  ) {}

  validate(input: any): Error | void {
    const isInvalidDateObj = Number.isNaN(
      new Date(input[this.accessor]).getTime()
    );
    if (input[this.accessor] && isInvalidDateObj) {
      return new InvalidParamError(this.fieldNameI18N, this.language);
    }
  }
}
