import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { Request, Response } from "express";
import { acceptLanguageHeaderUtil, ILanguage } from "./utils";

export function ExpressRouteAdapter(
  makeController: (language: ILanguage) => any
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
    const acceptLanguageHeader = request.headers["accept-language"];
    const parsedHeader = acceptLanguageHeaderUtil.parseAcceptLanguage(
      acceptLanguageHeader as string | undefined
    );
    const languageMatch =
      acceptLanguageHeaderUtil.findBestMatchingLanguage(parsedHeader);
    response.setHeader("Content-Language", languageMatch.tag);
    const controller = makeController(languageMatch.language);

    const { statusCode, body }: HttpResponse = await controller.handleRequest(
      request.body
    );

    let jsonResponse = body;
    if (body instanceof Error) {
      jsonResponse = { error: { message: body.message } };
    }

    response.status(statusCode).json(jsonResponse);
  };
}
