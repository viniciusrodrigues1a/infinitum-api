import { IJob } from "@shared/infra/queue/interfaces";
import { emailJobHandler, EmailJobHandlerPayload } from "./emailJobHandler";

export class SendInvitationEmailJob implements IJob {
  public key = "InvitationEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
