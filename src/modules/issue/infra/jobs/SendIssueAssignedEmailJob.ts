import { EmailJobHandlerPayload, emailJobHandler } from "@shared/infra/jobs";
import { IJob } from "@shared/infra/queue/interfaces";

export class SendIssueAssignedEmailJob implements IJob {
  public key = "IssueAssignedEmailJob";

  handle(payload: EmailJobHandlerPayload): void {
    emailJobHandler(payload);
  }
}
