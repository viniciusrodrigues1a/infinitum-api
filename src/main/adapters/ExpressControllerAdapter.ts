import { ILanguage } from "@shared/presentation/languages";
import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { IController } from "@shared/presentation/interfaces/controllers";
import { Request, Response } from "express";
import { acceptLanguageHeaderUtil } from "@main/middlewares/utils";

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
        languages: acceptLanguageHeaderUtil.languages,
        fileBuffer: request.fileBuffer,
        accountEmailMakingRequest: request.authorizedAccountEmail,
      });

    let jsonResponse = body;
    if (body instanceof Error) {
      jsonResponse = { error: { message: body.message, debugMessage: debug } };
    }

    response.status(statusCode).json(jsonResponse);
  };
}
