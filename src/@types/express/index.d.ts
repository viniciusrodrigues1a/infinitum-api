declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    authorizedAccountEmail: string;
    language: any;
    fileBuffer: Buffer;
    projectId: string;
  }
}
