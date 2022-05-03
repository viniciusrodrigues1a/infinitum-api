import { IJob } from "@shared/infra/queue/interfaces";
import { emailJobHandler, EmailJobHandlerPayload } from "./emailJobHandler";

export class SendKickedEmailJob implements IJob {
  public key = "KickedEmailJob";

  async handle(payload: EmailJobHandlerPayload): Promise<void> {
    emailJobHandler(payload);
  }
}
