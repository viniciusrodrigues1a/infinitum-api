import { ILanguage } from "./ILanguage";

export class ENUSLanguage implements ILanguage {
  getCannotKickYourselfErrorMessage(): string {
    return "You cannot kick yourself from this project";
  }

  getCannotKickOwnerOfProjectErrorMessage(): string {
    return "You cannot kick the owner of the project";
  }

  getIssueGroupNotFoundErrorMessage(): string {
    return "Issue section couldn't be found";
  }

  getIssueGroupBelongsToDifferentProjectErrorMessage(): string {
    return "You cannot move this issue to a section of a different project";
  }

  getIssuesWeeklyOverviewWeekdays(): string[] {
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  }

  getCompletedParamMessage(): string {
    return "completed";
  }

  getCannotUpdateRoleToOwnerErrorMessage(): string {
    return "You cannot update someone's role to owner";
  }

  getCannotUpdateYourOwnRoleErrorMessage(): string {
    return "You cannot update your own role";
  }

  getCannotUpdateRoleOfOwnerMessage(): string {
    return "You cannot update the role of the owner of the project";
  }

  getInvalidInvitationTokenErrorMessage(): string {
    return "Invitation token is not valid";
  }

  getOwnerCantBeUsedAsARoleForAnInvitationErrorMessage(): string {
    return "You cannot invite a user for the owner role of this project";
  }

  getAccountHasAlreadyBeenInvitedErrorMessage(_email: string): string {
    return "This user has already been invited to this project";
  }

  getAccountAlreadyParticipatesInProjectErrorMessage(_email: string): string {
    return "This user is already a participant of this project";
  }

  getIssueNotFoundErrorMessage(): string {
    return "Issue not found";
  }

  getIssueIdParamMessage(): string {
    return "issue id";
  }

  getRoleNameParamMessage(): string {
    return "role name";
  }

  getExpiresAtParamMessage(): string {
    return "expires at";
  }

  getIssueGroupIdParamMessage(): string {
    return "issue section id";
  }

  getProjectIdParamMessage(): string {
    return "project id";
  }

  getTitleParamMessage(): string {
    return "title";
  }

  getDescriptionParamMessage(): string {
    return "description";
  }

  getBeginsAtParamMessage(): string {
    return "begins at";
  }

  getFinishesAtParamMessage(): string {
    return "finishes at";
  }

  getNameParamMessage(): string {
    return "name";
  }

  getEmailParamMessage(): string {
    return "email";
  }

  getPasswordParamMessage(): string {
    return "password";
  }

  getNoParamProvidedErrorMessage(): string {
    return "No param was specified";
  }

  getInvalidParamErrorMessage(param: string): string {
    return `Invalid param: ${param}`;
  }

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

  getProjectNotFoundErrorMessage(): string {
    return "Project not found";
  }

  getBeginsAtMustBeBeforeFinishesAtErrorMessage(): string {
    return "End date must not be before start date for project";
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
