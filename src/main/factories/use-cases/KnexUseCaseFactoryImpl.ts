import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteProjectUseCase,
  InviteAccountToProjectUseCase,
  ListProjectsOwnedByAccountUseCase,
  UpdateProjectUseCase,
} from "@modules/project/use-cases";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import { CreateIssueUseCase } from "@modules/issue/use-cases";
import { DeleteIssueUseCase } from "@modules/issue/use-cases/DeleteIssueUseCase";
import { IUseCaseFactory } from "./IUseCaseFactory";
import NodemailerSendInvitationToProjectEmailServiceFactory from "../services/NodemailerSendInvitationToProjectEmailServiceFactory";

class KnexUseCaseFactoryImpl implements IUseCaseFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

  makeInviteAccountToProjectUseCase(
    language: ILanguage
  ): InviteAccountToProjectUseCase {
    const projectRepository = this.repositoryFactory.makeProjectRepository();
    return new InviteAccountToProjectUseCase(
      projectRepository,
      NodemailerSendInvitationToProjectEmailServiceFactory.make(),
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
