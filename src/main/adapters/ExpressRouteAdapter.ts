import { ILanguage } from "@modules/account/presentation/languages";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { Request, Response } from "express";

export function ExpressRouteAdapter(
  makeController: (language: ILanguage) => any
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
    const controller = makeController(request.language);

    const { statusCode, body }: HttpResponse = await controller.handleRequest({
      ...request.body,
      ...request.query,
      accountEmailMakingRequest: request.authorizedAccountEmail,
    });

    let jsonResponse = body;
    if (body instanceof Error) {
      jsonResponse = { error: { message: body.message } };
    }

    response.status(statusCode).json(jsonResponse);
  };
}
