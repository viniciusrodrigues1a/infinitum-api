import Queue from "@shared/infra/queue/Queue";
import { NodemailerSendKickedOutOfProjectEmailService } from "@modules/project/infra/services/NodemailerSendKickedOutOfProjectEmailService";

class NodemailerSendKickedOutOfProjectEmailServiceFactory {
  make(): NodemailerSendKickedOutOfProjectEmailService {
    return new NodemailerSendKickedOutOfProjectEmailService(Queue);
  }
}

export default new NodemailerSendKickedOutOfProjectEmailServiceFactory();
