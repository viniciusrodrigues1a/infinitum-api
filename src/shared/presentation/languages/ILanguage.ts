import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { IInvalidCredentialsErrorLanguage } from "@modules/account/presentation/languages/IInvalidCredentialsErrorLanguage";
import {
  IAccountNotFoundErrorLanguage,
  IEmailAlreadyInUseErrorLanguage,
} from "@modules/account/use-cases/interfaces/languages";
import { IIssueNotFoundErrorLanguage } from "@modules/issue/use-cases/interfaces/languages";
import {
  IBeginsAtMustBeBeforeFinishesAtErrorLanguage,
  IInvalidRoleNameErrorLanguage,
} from "@modules/project/entities/interfaces/languages";
import {
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
    IIssueNotFoundErrorLanguage {}
