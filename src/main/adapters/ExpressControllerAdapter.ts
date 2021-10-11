import { ILanguage } from "@modules/account/presentation/languages";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { Request, Response } from "express";

export function ExpressControllerAdapter(
  makeController: (language: ILanguage) => IController
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
    const controller = makeController(request.language);

    const { statusCode, body, debug }: HttpResponse =
      await controller.handleRequest({
        ...request.body,
        ...request.query,
        ...request.params,
        accountEmailMakingRequest: request.authorizedAccountEmail,
      });

    let jsonResponse = body;
    if (body instanceof Error) {
      jsonResponse = { error: { message: body.message, debugMessage: debug } };
    }

    response.status(statusCode).json(jsonResponse);
  };
}
