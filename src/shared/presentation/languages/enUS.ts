import { IDateProvider } from "../interfaces/providers";
import { ILanguage } from "./ILanguage";

export class ENUSLanguage implements ILanguage {
  constructor(private readonly dateProvider: IDateProvider) {}

  getAssignedToEmailParamMessage(): string {
    return "assigned to email";
  }

  getNotificationNotFoundErrorMessage(): string {
    return "Notification not found";
  }

  getNotificationDoesntBelongToYouErrorMessage(): string {
    return "Notification doesn't belong to you";
  }

  getRoleUpdatedText(projectName: string, roleName: string): string {
    return `Your role in project ${projectName} has been updated to ${roleName}`;
  }

  getRoleUpdatedEmailSubject(): string {
    return "Infinitum - Your role in a project has been updated";
  }

  getKickedEmailSubject(): string {
    return "Infinitum - Project expulsion notice";
  }

  getKickedText(projectName: string): string {
    return `You have been removed from the project ${projectName} and won't be able to acess it on the platform anymore.`;
  }

  getInvitationEmailSubject(): string {
    return "Infinitum - Invitation to project";
  }

  getInvitationText(projectName: string): string {
    return `You have been invited to participate in the project: ${projectName}`;
  }

  getAcceptInvitationButtonText(): string {
    return "Accept invitation";
  }

  getDeclineInvitationButtonText(): string {
    return "Decline invitation";
  }

  getTodoIssueGroupTitle(): string {
    return "Todo";
  }

  getInProgressIssueGroupTitle(): string {
    return "In progress";
  }

  getCompletedIssueGroupTitle(): string {
    return "Done";
  }

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

  getProjectHasntBegunErrorMessage(date: Date): string {
    return `This project will begin in ${this.dateProvider.getFullDate(date)}`;
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
