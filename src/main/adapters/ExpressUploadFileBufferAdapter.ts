import { NextFunction, Request, Response } from "express";

export function ExpressUploadFileBufferAdapter(): (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void> {
  return async (request: Request, response: Response, next: NextFunction) => {
    request.fileBuffer = request.file!.buffer;

    next();
  };
}
