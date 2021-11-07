import Bull from "bull";
import { IQueue } from "./IQueue";
import { IJob } from "./jobs";
import InvitationEmailJob from "./jobs/InvitationEmailJob";

type QueueEntry = {
  bull: Bull.Queue;
  handle: IJob["handle"];
};

class Queue implements IQueue {
  private jobs: IJob[] = [InvitationEmailJob];
  queues: { [key: string]: QueueEntry } = {};

  constructor() {
    this.queues = {};

    this.init();
  }

  public add(queueKey: string, jobData: any): void {
    this.queues[queueKey].bull.add(jobData);
  }

  public processQueue(): void {
    this.jobs.forEach((job) => {
      const { bull, handle } = this.queues[job.key];

      bull.on("error", this.onError);
      bull.process((bullJob) => handle(bullJob.data));
    });
  }

  public async close(): Promise<void> {
    this.jobs.forEach(async (job) => {
      await this.queues[job.key].bull.close();
    });
  }

  private onError(err: Error): void {
    console.log("Job error: ", err.message);
  }

  private init() {
    this.jobs.forEach((job) => {
      this.queues[job.key] = {
        bull: new Bull(job.key, "redis://redishost:6379"),
        handle: job.handle,
      };
    });
  }
}

export default new Queue();
