import { AcceptInvitationToProjectUseCaseDTO } from "./DTOs";
import { InvalidInvitationTokenError } from "./errors/InvalidInvitationTokenError";
import { IInvalidInvitationTokenErrorLanguage } from "./interfaces/languages";
import {
  IAcceptInvitationTokenRepository,
  IFindOneAccountEmailByInvitationTokenRepository,
  IIsInvitationTokenValidRepository,
} from "./interfaces/repositories";

export class AcceptInvitationToProjectUseCase {
  constructor(
    private readonly acceptInvitationTokenRepository: IAcceptInvitationTokenRepository,
    private readonly isInvitationTokenValidRepository: IIsInvitationTokenValidRepository,
    private readonly findOneAccountEmailByInvitationTokenRepository: IFindOneAccountEmailByInvitationTokenRepository,
    private readonly invalidInvitationTokenErrorLanguage: IInvalidInvitationTokenErrorLanguage
  ) {}

  async accept({
    accountEmailMakingRequest,
    token,
  }: AcceptInvitationToProjectUseCaseDTO): Promise<void> {
    const isTokenValid =
      await this.isInvitationTokenValidRepository.isInvitationTokenValid(token);
    if (!isTokenValid) {
      throw new InvalidInvitationTokenError(
        this.invalidInvitationTokenErrorLanguage
      );
    }

    const accountEmailBeingInvited =
      await this.findOneAccountEmailByInvitationTokenRepository.findOneAccountEmailByInvitationToken(
        token
      );
    if (accountEmailBeingInvited !== accountEmailMakingRequest) {
      throw new InvalidInvitationTokenError(
        this.invalidInvitationTokenErrorLanguage
      );
    }

    await this.acceptInvitationTokenRepository.acceptInvitationToken(token);
  }
}
