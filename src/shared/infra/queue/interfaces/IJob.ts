export interface IJob {
  key: string;
  handle(payload: any): Promise<void>;
}
