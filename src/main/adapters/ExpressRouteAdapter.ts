import { IAccountLanguage } from "@modules/account/presentation/languages";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { Request, Response } from "express";
import { AcceptLanguageHeaderUtil } from "./utils";

type ILanguage = IAccountLanguage;

export function ExpressRouteAdapter(
  makeController: (language: ILanguage) => any
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
    const acceptLanguageHeader = request.headers["accept-language"];
    const headerUtil = new AcceptLanguageHeaderUtil();
    const parsedHeader = headerUtil.parseAcceptLanguage(
      acceptLanguageHeader as string | undefined
    );
    const language = headerUtil.findBestMatchingLanguage(parsedHeader);
    const controller = makeController(language);

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
