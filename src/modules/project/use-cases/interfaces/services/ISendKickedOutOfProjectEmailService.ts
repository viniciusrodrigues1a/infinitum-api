import { SendKickedOutOfProjectEmailServiceDTO } from "../../DTOs";

export interface ISendKickedOutOfProjectEmailService {
  sendKickedOutOfProjectEmail(
    data: SendKickedOutOfProjectEmailServiceDTO
  ): Promise<void>;
}
