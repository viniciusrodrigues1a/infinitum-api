import { SendIssueAssignedEmailJob } from "@modules/issue/infra/jobs";
import {
  SendInvitationEmailJob,
  SendKickedEmailJob,
  SendRoleUpdatedEmailJob,
} from "@modules/project/infra/jobs";
import Bull, { Job } from "bull";
import { IJob, IQueue } from "./interfaces";

type QueueEntry = {
  bull: Bull.Queue;
  handle: IJob["handle"];
};

class Queue implements IQueue {
  constructor() {
    this.queues = {};

    this.init();
  }

  public jobs: IJob[] = [
    new SendInvitationEmailJob(),
    new SendKickedEmailJob(),
    new SendRoleUpdatedEmailJob(),
    new SendIssueAssignedEmailJob(),
  ];
  queues: { [key: string]: QueueEntry } = {};

  public add(queueKey: string, jobData: any): void {
    this.queues[queueKey].bull.add(jobData);
  }

  public processQueue(): void {
    this.jobs.forEach((job) => {
      console.log(`Started processing queue: ${job.key}`);

      const { bull, handle } = this.queues[job.key];

      bull.on("error", this.onError);
      bull.on("completed", this.onCompleted);
      bull.on("waiting", this.onWaiting);
      bull.on("active", this.onActive);
      bull.on("removed", this.onRemoved);
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

  private onCompleted(job: Job): void {
    console.log(`Job ${job.id} has finished being processed`);
  }

  private onWaiting(job: Job): void {
    console.log(`Job ${job.id} is waiting to be processed`);
  }

  private onActive(job: Job): void {
    console.log(`Job ${job.id} has started being processed`);
  }

  private onRemoved(job: Job): void {
    console.log(`Job ${job.id} has being removed`);
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
