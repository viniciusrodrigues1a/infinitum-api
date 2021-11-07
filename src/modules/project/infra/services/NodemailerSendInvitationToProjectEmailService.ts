import { SendInvitationToProjectEmailServiceDTO } from "@modules/project/use-cases/DTOs";
import { ISendInvitationToProjectEmailService } from "@modules/project/use-cases/interfaces/services";
import { IQueue } from "@shared/infra/queue";
import InvitationEmailJob from "@shared/infra/queue/jobs/InvitationEmailJob";

export class NodemailerSendInvitationToProjectEmailService
  implements ISendInvitationToProjectEmailService
{
  constructor(private readonly queue: IQueue) {}

  async sendInvitationEmail({
    token,
    projectName,
    email,
  }: SendInvitationToProjectEmailServiceDTO): Promise<void> {
    this.queue.add(InvitationEmailJob.key, { email, projectName, token });
  }
}
