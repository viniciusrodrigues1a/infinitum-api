import { InvitationToken } from "../entities/value-objects";
import { InvalidInvitationTokenError } from "./errors/InvalidInvitationTokenError";
import { IInvalidInvitationTokenErrorLanguage } from "./interfaces/languages";
import {
  IAcceptInvitationTokenRepository,
  IIsInvitationTokenValidRepository,
} from "./interfaces/repositories";

export class AcceptInvitationToProjectUseCase {
  constructor(
    private readonly acceptInvitationTokenRepository: IAcceptInvitationTokenRepository,
    private readonly isInvitationTokenValidRepository: IIsInvitationTokenValidRepository,
    private readonly invalidInvitationTokenErrorLanguage: IInvalidInvitationTokenErrorLanguage
  ) {}

  async accept(token: InvitationToken): Promise<void> {
    const isTokenValid =
      await this.isInvitationTokenValidRepository.isInvitationTokenValid(token);
    if (!isTokenValid) {
      throw new InvalidInvitationTokenError(
        this.invalidInvitationTokenErrorLanguage
      );
    }

    await this.acceptInvitationTokenRepository.acceptInvitationToken(token);
  }
}
