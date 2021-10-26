import { IValidation } from "./IValidation";

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}

  validate(input: any): Error | void {
    for (let i = 0; i < this.validations.length; i++) {
      const validation = this.validations[i];
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
  }
}
