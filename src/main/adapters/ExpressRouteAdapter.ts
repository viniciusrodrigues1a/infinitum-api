import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { Request, Response } from "express";

export function ExpressRouteAdapter(
  controller: any
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
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
