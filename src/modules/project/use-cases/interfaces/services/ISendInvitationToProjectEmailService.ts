import { SendInvitationToProjectEmailServiceDTO } from "../../DTOs";

export interface ISendInvitationToProjectEmailService {
  sendInvitationEmail(
    data: SendInvitationToProjectEmailServiceDTO
  ): Promise<void>;
}
