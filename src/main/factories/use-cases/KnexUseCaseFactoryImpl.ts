import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteProjectUseCase,
  InviteAccountToProjectUseCase,
  KickParticipantFromProjectUseCase,
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
  CreateIssueUseCase,
  UpdateIssueUseCase,
} from "@modules/issue/use-cases";
import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import { AcceptInvitationToProjectUseCase } from "@modules/project/use-cases/AcceptInvitationToProjectUseCase";
import { IUseCaseFactory } from "./IUseCaseFactory";
import NodemailerSendInvitationToProjectEmailServiceFactory from "../services/NodemailerSendInvitationToProjectEmailServiceFactory";
import NodemailerSendKickedOutOfProjectEmailServiceFactory from "../services/NodemailerSendKickedOutOfProjectEmailServiceFactory";

class KnexUseCaseFactoryImpl implements IUseCaseFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeUpdateParticipantRoleInProjectUseCase(
    language: ILanguage
  ): UpdateParticipantRoleInProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new UpdateParticipantRoleInProjectUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
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
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new RevokeInvitationUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
      language,
      language,
      language
    );
  }

  makeKickParticipantFromProjectUseCase(
    language: ILanguage
  ): KickParticipantFromProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new KickParticipantFromProjectUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      NodemailerSendKickedOutOfProjectEmailServiceFactory.make(),
      language,
      language,
      language,
      language
    );
  }

  makeAcceptInvitationToProjectUseCase(
    language: ILanguage
  ): AcceptInvitationToProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new AcceptInvitationToProjectUseCase(
      projectRepository,
      projectRepository,
      language
    );
  }

  makeUpdateIssueUseCase(language: ILanguage): UpdateIssueUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    const issueRepository = this.repositoryFactory.makeIssueRepository();
    return new UpdateIssueUseCase(
      issueRepository,
      issueRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
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
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    const accountRepository = this.repositoryFactory.makeAccountRepository();
    return new InviteAccountToProjectUseCase(
      projectRepository,
      NodemailerSendInvitationToProjectEmailServiceFactory.make(),
      projectRepository,
      accountRepository,
      projectRepository,
      projectRepository,
      projectRepository,
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
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    const issueRepository = this.repositoryFactory.makeIssueRepository();
    return new DeleteIssueUseCase(
      issueRepository,
      issueRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeCreateIssueUseCase(language: ILanguage): CreateIssueUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    const issueRepository = this.repositoryFactory.makeIssueRepository();
    return new CreateIssueUseCase(
      issueRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
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
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new CreateIssueGroupForProjectUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
      language,
      language,
      language
    );
  }

  makeListProjectsOwnedByAccountUseCase(): ListProjectsOwnedByAccountUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new ListProjectsOwnedByAccountUseCase(projectRepository);
  }

  makeUpdateProjectUseCase(language: ILanguage): UpdateProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new UpdateProjectUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
      language,
      language,
      language,
      language,
      language,
      language
    );
  }

  makeDeleteProjectUseCase(language: ILanguage): DeleteProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new DeleteProjectUseCase(
      projectRepository,
      projectRepository,
      projectRepository,
      projectRepository,
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
