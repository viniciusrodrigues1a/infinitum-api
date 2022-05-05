import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendKickedAdminEmailJob implements IJob {
  public key = "KickedAdminEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
