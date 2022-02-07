import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages";
import {
  IAccountNotFoundErrorLanguage,
  IEmailAlreadyInUseErrorLanguage,
} from "@modules/account/use-cases/interfaces/languages";
import { IIssuesWeeklyOverviewWeekdaysLanguage } from "@modules/issue/presentation/interfaces/languages";
import {
  IIssueGroupBelongsToDifferentProjectErrorLanguage,
  IIssueGroupNotFoundErrorLanguage,
  IIssueNotFoundErrorLanguage,
} from "@modules/issue/use-cases/interfaces/languages";
import {
  IBeginsAtMustBeBeforeFinishesAtErrorLanguage,
  IInvalidRoleNameErrorLanguage,
  IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
} from "@modules/project/entities/interfaces/languages";
import {
  ICompletedIssueGroupTitleLanguage,
  IInProgressIssueGroupTitleLanguage,
  ITodoIssueGroupTitleLanguage,
} from "@modules/project/presentation/interfaces/languages";
import {
  IAccountAlreadyParticipatesInProjectErrorLanguage,
  IAccountHasAlreadyBeenInvitedErrorLanguage,
  ICannotKickOwnerOfProjectErrorLanguage,
  ICannotKickYourselfErrorLanguage,
  ICannotUpdateRoleOfOwnerErrorLanguage,
  ICannotUpdateRoleToOwnerErrorLanguage,
  ICannotUpdateYourOwnRoleErrorLanguage,
  IInvalidInvitationTokenErrorLanguage,
  IProjectHasntBegunErrorLanguage,
  IProjectIsArchivedErrorLanguage,
} from "@modules/project/use-cases/interfaces/languages";
import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import {
  INotParticipantInProjectErrorLanguage,
  IProjectNotFoundErrorLanguage,
  IRoleInsufficientPermissionErrorLanguage,
} from "@shared/use-cases/interfaces/languages";
import {
  IInvalidParamErrorLanguage,
  IMissingParamsErrorLanguage,
  INoParamProvidedErrorLanguage,
  IParamsLanguage,
} from "../interfaces/languages";

export interface ILanguage
  extends IInvalidEmailErrorLanguage,
    IEmailAlreadyInUseErrorLanguage,
    IInvalidCredentialsErrorLanguage,
    IAccountNotFoundErrorLanguage,
    INotFutureDateErrorLanguage,
    IMissingParamsErrorLanguage,
    IBeginsAtMustBeBeforeFinishesAtErrorLanguage,
    IProjectNotFoundErrorLanguage,
    INotParticipantInProjectErrorLanguage,
    IInvalidRoleNameErrorLanguage,
    IRoleInsufficientPermissionErrorLanguage,
    IProjectHasntBegunErrorLanguage,
    IProjectIsArchivedErrorLanguage,
    IParamsLanguage,
    IInvalidParamErrorLanguage,
    INoParamProvidedErrorLanguage,
    IIssueNotFoundErrorLanguage,
    IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
    IAccountHasAlreadyBeenInvitedErrorLanguage,
    IAccountAlreadyParticipatesInProjectErrorLanguage,
    IInvalidInvitationTokenErrorLanguage,
    ICannotUpdateRoleToOwnerErrorLanguage,
    ICannotUpdateYourOwnRoleErrorLanguage,
    ICannotUpdateRoleOfOwnerErrorLanguage,
    IIssuesWeeklyOverviewWeekdaysLanguage,
    IIssueGroupNotFoundErrorLanguage,
    IIssueGroupBelongsToDifferentProjectErrorLanguage,
    ICannotKickOwnerOfProjectErrorLanguage,
    ICannotKickYourselfErrorLanguage,
    ITodoIssueGroupTitleLanguage,
    IInProgressIssueGroupTitleLanguage,
    ICompletedIssueGroupTitleLanguage {}
