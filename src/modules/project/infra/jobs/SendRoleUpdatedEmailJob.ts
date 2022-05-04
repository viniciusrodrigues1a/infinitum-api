import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendRoleUpdatedEmailJob implements IJob {
  public key = "RoleUpdatedEmailJob";

  handle(payload: EmailJobHandlerPayload): void {
    emailJobHandler(payload);
  }
}
