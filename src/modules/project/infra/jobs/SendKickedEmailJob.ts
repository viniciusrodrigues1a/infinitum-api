import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendKickedEmailJob implements IJob {
  public key = "KickedEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
