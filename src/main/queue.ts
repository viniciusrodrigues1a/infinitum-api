import "dotenv/config";
import Queue from "@shared/infra/queue/Queue";

console.log("Rodando a queue");
Queue.processQueue();
