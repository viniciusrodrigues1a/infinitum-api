import { SendKickedOutOfProjectEmailServiceDTO } from "@modules/project/use-cases/DTOs";
import { ISendKickedOutOfProjectEmailService } from "@modules/project/use-cases/interfaces/services";
import { IQueue } from "@shared/infra/queue";
import KickedOutOfProjectEmailJob from "@shared/infra/queue/jobs/KickedOutOfProjectEmailJob";

export class NodemailerSendKickedOutOfProjectEmailService
  implements ISendKickedOutOfProjectEmailService
{
  constructor(private readonly queue: IQueue) {}

  async sendKickedOutOfProjectEmail({
    projectName,
    email,
  }: SendKickedOutOfProjectEmailServiceDTO): Promise<void> {
    this.queue.add(KickedOutOfProjectEmailJob.key, {
      email,
      projectName,
    });
  }
}
