import { ILanguage } from "@shared/presentation/languages/ILanguage";
import {
  AtLeastOneFieldRequiredValidation,
  FieldIsDateValidation,
  FieldIsRequiredValidation,
  FieldIsStringValidation,
  IValidation,
  ValidationComposite,
} from "@shared/presentation/validation";

type Field = {
  accessor: string;
  i18n: string;
};

export class ControllerValidationFactory {
  makeUpdateIssueControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const stringFields = [
      { accessor: "newTitle", i18n: language.getTitleParamMessage() },
      {
        accessor: "newDescription",
        i18n: language.getDescriptionParamMessage(),
      },
      { accessor: "newExpiresAt", i18n: language.getExpiresAtParamMessage() },
    ];

    const validations = this.makeAllString(stringFields, language);

    return new ValidationComposite(validations);
  }

  makeInviteAccountToProjectControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "roleName", i18n: language.getRoleNameParamMessage() },
      { accessor: "projectName", i18n: language.getProjectNameParamMessage() },
      { accessor: "projectId", i18n: language.getProjectIdParamMessage() },
      {
        accessor: "accountEmail",
        i18n: language.getEmailParamMessage(),
      },
    ];

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllString(requiredAndStringFields, language);
    const validations = [...required, ...string];

    return new ValidationComposite(validations);
  }

  makeCreateIssueControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "title", i18n: language.getTitleParamMessage() },
      { accessor: "description", i18n: language.getDescriptionParamMessage() },
      {
        accessor: "issueGroupId",
        i18n: language.getIssueGroupIdParamMessage(),
      },
    ];
    const dateFields = [
      { accessor: "expiresAt", i18n: language.getExpiresAtParamMessage() },
    ];
    const notEmptyValidation = new AtLeastOneFieldRequiredValidation(
      ["title", "description", "issueGroupId", "expiresAt"],
      language
    );

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllString(requiredAndStringFields, language);
    const date = this.makeAllDate(dateFields, language);

    const validations = [notEmptyValidation, ...required, ...string, ...date];

    return new ValidationComposite(validations);
  }

  makeCreateIssueGroupForProjectControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "title", i18n: language.getTitleParamMessage() },
      { accessor: "projectId", i18n: language.getProjectIdParamMessage() },
    ];

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllRequired(requiredAndStringFields, language);

    const validations = [...required, ...string];

    return new ValidationComposite(validations);
  }

  makeUpdateProjectControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const stringFields = [
      { accessor: "name", i18n: language.getNameParamMessage() },
      { accessor: "description", i18n: language.getDescriptionParamMessage() },
    ];
    const dateFields = [
      { accessor: "beginsAt", i18n: language.getBeginsAtParamMessage() },
      { accessor: "finishesAt", i18n: language.getFinishesAtParamMessage() },
    ];

    const string = this.makeAllString(stringFields, language);
    const date = this.makeAllDate(dateFields, language);
    const notEmptyValidation = new AtLeastOneFieldRequiredValidation(
      ["name", "description", "beginsAt", "finishesAt"],
      language
    );

    const validations = [notEmptyValidation, ...string, ...date];

    return new ValidationComposite(validations);
  }

  makeCreateProjectControllerValidation(
    language: ILanguage
  ): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "name", i18n: language.getNameParamMessage() },
      { accessor: "description", i18n: language.getDescriptionParamMessage() },
    ];
    const dateFields = [
      { accessor: "beginsAt", i18n: language.getBeginsAtParamMessage() },
      { accessor: "finishesAt", i18n: language.getFinishesAtParamMessage() },
    ];

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllString(requiredAndStringFields, language);
    const date = this.makeAllDate(dateFields, language);

    const validations = [...required, ...string, ...date];

    return new ValidationComposite(validations);
  }

  makeLoginControllerValidation(language: ILanguage): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "email", i18n: language.getEmailParamMessage() },
      { accessor: "password", i18n: language.getPasswordParamMessage() },
    ];

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllString(requiredAndStringFields, language);

    const validations = [...required, ...string];

    return new ValidationComposite(validations);
  }

  private makeAllRequired(fields: Field[], language: ILanguage): IValidation[] {
    return this._makeAllValidation(fields, language, FieldIsRequiredValidation);
  }

  makeRegisterControllerValidation(language: ILanguage): ValidationComposite {
    const requiredAndStringFields = [
      { accessor: "name", i18n: language.getNameParamMessage() },
      { accessor: "email", i18n: language.getEmailParamMessage() },
      { accessor: "password", i18n: language.getPasswordParamMessage() },
    ];

    const required = this.makeAllRequired(requiredAndStringFields, language);
    const string = this.makeAllString(requiredAndStringFields, language);

    const validations = [...required, ...string];

    return new ValidationComposite(validations);
  }

  private makeAllString(fields: Field[], language: ILanguage): IValidation[] {
    return this._makeAllValidation(fields, language, FieldIsStringValidation);
  }

  private makeAllDate(fields: Field[], language: ILanguage): IValidation[] {
    return this._makeAllValidation(fields, language, FieldIsDateValidation);
  }

  private _makeAllValidation(
    fields: Field[],
    language: ILanguage,
    Validation: any
  ): IValidation[] {
    const validations = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      validations.push(new Validation(field.accessor, field.i18n, language));
    }

    return validations;
  }
}
