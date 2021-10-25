import { ILanguage } from "@modules/account/presentation/languages";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import {
  CreateIssueGroupForProjectUseCase,
  CreateProjectUseCase,
  DeleteProjectUseCase,
  ListProjectsOwnedByAccountUseCase,
  UpdateProjectUseCase,
} from "@modules/project/use-cases";
import {
  IRepositoryFactory,
  knexRepositoryFactoryImpl,
} from "@main/factories/repositories";
import { IUseCaseFactory } from "./IUseCaseFactory";

class KnexUseCaseFactoryImpl implements IUseCaseFactory {
  private repositoryFactory: IRepositoryFactory = knexRepositoryFactoryImpl;

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
