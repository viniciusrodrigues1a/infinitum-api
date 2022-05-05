import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendRoleUpdatedAdminEmailJob implements IJob {
  public key = "RoleUpdatedAdminEmailJob";

  handle(payload: EmailJobHandlerPayload): void {
    emailJobHandler(payload);
  }
}
