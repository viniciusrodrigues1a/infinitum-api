import { IJob } from "./IJob";

export interface IQueue {
  add(queueKey: string, jobData: any): void;
  processQueue(): void;
  close(): Promise<void>;
}
