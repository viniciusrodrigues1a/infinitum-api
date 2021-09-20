import { ILanguage } from "@shared/presentation/languages/ILanguage";
import { NextFunction, Request, Response } from "express";

export function ExpressMiddlewareAdapter(
  makeMiddleware: (language: ILanguage) => any
): (request: Request, response: Response, next: NextFunction) => Promise<void> {
  return async (request: Request, response: Response, next: NextFunction) => {
    const middleware = makeMiddleware(request.language);

    middleware.handleRequest(request, response, next);
  };
}
