import { ILanguage } from "@shared/presentation/languages";

import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteIssueGroupUseCase,
  DeleteProjectUseCase,
  InviteAccountToProjectUseCase,
  KickParticipantFromProjectUseCase,
  ListParticipantsInvitedToProjectUseCase,
  ListProjectsOwnedByAccountUseCase,
  RevokeInvitationUseCase,
  UpdateParticipantRoleInProjectUseCase,
  UpdateProjectUseCase,
} from "@modules/project/use-cases";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import {
  AssignIssueToAccountUseCase,
  CreateIssueUseCase,
  MoveIssueToAnotherIssueGroupUseCase,
  UpdateIssueUseCase,
} from "@modules/issue/use-cases";
import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";
import { IUseCaseFactory } from "./IUseCaseFactory";

class KnexUseCaseFactoryImpl implements IUseCaseFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeDeleteIssueGroupUseCase(language: ILanguage): DeleteIssueGroupUseCase {
    return new DeleteIssueGroupUseCase(
      this.repositoryFactory.makeDeleteIssueGroupRepository(),
      this.repositoryFactory.makeDoesIssueGroupExistRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueGroupIdRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language
    );
  }

  makeListParticipantsInvitedToProjectUseCase(
    language: ILanguage
  ): ListParticipantsInvitedToProjectUseCase {
    return new ListParticipantsInvitedToProjectUseCase(
      this.repositoryFactory.makeListParticipantsInvitedToProjectRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language
    );
  }

  makeAssignIssueToAccountUseCase(
    language: ILanguage
  ): AssignIssueToAccountUseCase {
    return new AssignIssueToAccountUseCase(
      this.repositoryFactory.makeAssignIssueToAccountRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueIdRepository(),
      this.repositoryFactory.makeDoesIssueExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language
    );
  }

  makeMoveIssueToAnotherIssueGroupUseCase(
    language: ILanguage
  ): MoveIssueToAnotherIssueGroupUseCase {
    return new MoveIssueToAnotherIssueGroupUseCase(
      this.repositoryFactory.makeMoveIssueToAnotherIssueGroupRepository(),
      this.repositoryFactory.makeDoesIssueExistRepository(),
      this.repositoryFactory.makeDoesIssueGroupExistRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueGroupIdRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueIdRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      this.repositoryFactory.makeShouldIssueGroupUpdateIssuesToCompletedRepository(),
      this.repositoryFactory.makeUpdateIssueRepository(),
      language,
      language,
      language,
      language,
      language
    );
  }

  makeUpdateParticipantRoleInProjectUseCase(
    language: ILanguage
  ): UpdateParticipantRoleInProjectUseCase {
    return new UpdateParticipantRoleInProjectUseCase(
      this.repositoryFactory.makeUpdateParticipantRoleInProjectRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeRevokeInvitationUseCase(language: ILanguage): RevokeInvitationUseCase {
    return new RevokeInvitationUseCase(
      this.repositoryFactory.makeRevokeInvitationRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesAccountExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language
    );
  }

  makeKickParticipantFromProjectUseCase(
    language: ILanguage
  ): KickParticipantFromProjectUseCase {
    return new KickParticipantFromProjectUseCase(
      this.repositoryFactory.makeKickParticipantFromProjectRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeAcceptInvitationToProjectUseCase(
    language: ILanguage
  ): AcceptInvitationToProjectUseCase {
    return new AcceptInvitationToProjectUseCase(
      this.repositoryFactory.makeAcceptInvitationTokenRepository(),
      this.repositoryFactory.makeIsInvitationTokenValidRepository(),
      this.repositoryFactory.makeFindOneAccountEmailByInvitationTokenRepository(),
      language
    );
  }

  makeUpdateIssueUseCase(language: ILanguage): UpdateIssueUseCase {
    return new UpdateIssueUseCase(
      this.repositoryFactory.makeUpdateIssueRepository(),
      this.repositoryFactory.makeFindOneIssueRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueIdRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language
    );
  }

  makeInviteAccountToProjectUseCase(
    language: ILanguage
  ): InviteAccountToProjectUseCase {
    return new InviteAccountToProjectUseCase(
      this.repositoryFactory.makeCreateInvitationTokenRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesAccountExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeHasAccountBeenInvitedToProjectRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeDeleteIssueUseCase(language: ILanguage): DeleteIssueUseCase {
    return new DeleteIssueUseCase(
      this.repositoryFactory.makeDeleteIssueRepository(),
      this.repositoryFactory.makeDoesIssueExistRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueIdRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language
    );
  }

  makeCreateIssueUseCase(language: ILanguage): CreateIssueUseCase {
    return new CreateIssueUseCase(
      this.repositoryFactory.makeCreateIssueRepository(),
      this.repositoryFactory.makeFindProjectIdByIssueGroupIdRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeHasProjectBegunRepository(),
      this.repositoryFactory.makeFindStartDateByProjectIdRepository(),
      this.repositoryFactory.makeIsProjectArchivedRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeCreateIssueGroupForProjectUseCase(
    language: ILanguage
  ): CreateIssueGroupForProjectUseCase {
    return new CreateIssueGroupForProjectUseCase(
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      this.repositoryFactory.makeCreateIssueGroupForProjectRepository(),
      language,
      language,
      language,
      language
    );
  }

  makeListProjectsOwnedByAccountUseCase(): ListProjectsOwnedByAccountUseCase {
    return new ListProjectsOwnedByAccountUseCase(
      this.repositoryFactory.makeListProjectsOwnedByAccountRepository()
    );
  }

  makeUpdateProjectUseCase(language: ILanguage): UpdateProjectUseCase {
    return new UpdateProjectUseCase(
      this.repositoryFactory.makeUpdateProjectRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeDeleteProjectUseCase(language: ILanguage): DeleteProjectUseCase {
    return new DeleteProjectUseCase(
      this.repositoryFactory.makeDeleteProjectRepository(),
      this.repositoryFactory.makeDoesProjectExistRepository(),
      this.repositoryFactory.makeDoesParticipantExistRepository(),
      this.repositoryFactory.makeFindParticipantRoleInProjectRepository(),
      language,
      language,
      language,
      language
    );
  }

  makeCreateProjectUseCase(language: ILanguage): CreateProjectUseCase {
    return new CreateProjectUseCase(
      this.repositoryFactory.makeCreateProjectRepository(),
      language,
      language
    );
  }

  makeFindOneAccountUseCase(language: ILanguage): FindOneAccountUseCase {
    return new FindOneAccountUseCase(
      this.repositoryFactory.makeFindOneAccountRepository(),
      language
    );
  }
}

export const knexUseCaseFactoryImpl = new KnexUseCaseFactoryImpl();
