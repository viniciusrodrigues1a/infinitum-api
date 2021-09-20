import { NextFunction, Request, Response } from "express";
import { acceptLanguageHeaderUtil } from "./utils";

export class LanguageMiddleware {
  async handleRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const acceptLanguageHeader = request.headers["accept-language"];

    const parsedHeader = acceptLanguageHeaderUtil.parseAcceptLanguage(
      acceptLanguageHeader as string | undefined
    );
    const languageMatch =
      acceptLanguageHeaderUtil.findBestMatchingLanguage(parsedHeader);

    request.language = languageMatch.language;

    response.setHeader("Content-Language", languageMatch.tag);
    next();
  }
}
