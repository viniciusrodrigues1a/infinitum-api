import { loadProject } from "@main/socketEvents";
import { NextFunction, Request, Response } from "express";

export class EmitProjectEventMiddleware {
  async handleRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { projectId } = request;

    if (projectId) {
      response.once("finish", () =>
        loadProject(projectId, request.authorizedAccountEmail)
      );
    }
    next();
  }
}
