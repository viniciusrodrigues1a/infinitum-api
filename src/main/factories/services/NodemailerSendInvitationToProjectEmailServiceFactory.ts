import Queue from "@shared/infra/queue/Queue";
import { NodemailerSendInvitationToProjectEmailService } from "@modules/project/infra/services/NodemailerSendInvitationToProjectEmailService";

class NodemailerSendInvitationToProjectEmailServiceFactory {
  make(): NodemailerSendInvitationToProjectEmailService {
    return new NodemailerSendInvitationToProjectEmailService(Queue);
  }
}

export default new NodemailerSendInvitationToProjectEmailServiceFactory();
