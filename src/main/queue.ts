import "dotenv/config";
import Queue from "@shared/infra/queue/Queue";

Queue.processQueue();
