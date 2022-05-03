import { IJob } from "@shared/infra/queue/interfaces";
import { emailJobHandler, EmailJobHandlerPayload } from "./emailJobHandler";

export class SendRoleUpdatedEmailJob implements IJob {
  public key = "RoleUpdatedEmailJob";

  handle(payload: EmailJobHandlerPayload): void {
    emailJobHandler(payload);
  }
}
