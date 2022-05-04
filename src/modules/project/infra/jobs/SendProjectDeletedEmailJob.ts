import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendProjectDeletedEmailJob implements IJob {
  public key = "ProjectDeletedEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
