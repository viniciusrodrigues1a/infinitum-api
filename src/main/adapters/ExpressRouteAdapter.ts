import { HttpResponse } from "@shared/presentation/http/HttpResponse";
import { Request, Response } from "express";

export function ExpressRouteAdapter(
  controller: any
): (request: Request, response: Response) => Promise<void> {
  return async (request: Request, response: Response) => {
    const { statusCode, body }: HttpResponse = await controller.handleRequest(
      request.body
    );

    response.status(statusCode).json(body);
  };
}
