import { NoParamProvidedError } from "@shared/presentation/errors";
import { INoParamProvidedErrorLanguage } from "@shared/presentation/interfaces/languages";
import { IValidation } from "./IValidation";

export class AtLeastOneFieldRequiredValidation implements IValidation {
  constructor(
    private readonly accessors: string[],
    private readonly language: INoParamProvidedErrorLanguage
  ) {}

  validate(input: any): Error | void {
    for (let i = 0; i < this.accessors.length; i++) {
      const accessor = this.accessors[i];
      if (accessor in input) return;
    }

    return new NoParamProvidedError(this.language);
  }
}
