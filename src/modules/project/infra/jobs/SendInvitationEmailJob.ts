import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendInvitationEmailJob implements IJob {
  public key = "InvitationEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
