import { ILanguage } from "./ILanguage";

export class ENUSLanguage implements ILanguage {
  getProjectHasntBegunErrorMessage(): string {
    return "This project hasn't begun yet";
  }

  getProjectIsArchivedErrorMessage(): string {
    return "This project is archived";
  }

  getNotParticipantInProjectErrorMessage(
    participantIdentifier: string
  ): string {
    return `Account ${participantIdentifier} doesn't participate in this project`;
  }

  getInvalidRoleNameErrorLanguage(_name: string): string {
    return "Role is invalid";
  }

  getRoleInsufficientPermissionErrorMessage(_roleIdentifier: string): string {
    return "You don't have permission";
  }

  getProjectNotFoundErrorMessage(_identifier: string): string {
    return "Project not found";
  }

  getBeginsAtMustBeBeforeFinishesAtErrorMessage(): string {
    return "End date must not be before start date for project";
  }

  getMissingParamsErrorNameParamMessage(): string {
    return "name";
  }

  getMissingParamsErrorDescriptionParamMessage(): string {
    return "description";
  }

  getMissingParamsErrorMessage(params: string[]): string {
    return `You need to specify: ${params.join(", ")}`;
  }

  getNotFutureDateErrorMessage(date: Date): string {
    return `Date ${date.toLocaleString()} can't be in the past`;
  }

  getInvalidCredentialsErrorMessage(): string {
    return "Invalid email or password";
  }

  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Account couldn't be found";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email is not valid";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email is already in use";
  }
}
