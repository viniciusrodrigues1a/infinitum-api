/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { HttpResponse } from "./HttpResponse";
import { HttpStatusCodes } from "./HttpStatusCodes";

export const okResponse = (body: any): HttpResponse => ({
  statusCode: HttpStatusCodes.ok,
  body,
});

export const createdResponse = (body: any): HttpResponse => ({
  statusCode: HttpStatusCodes.created,
  body,
});

export const noContentResponse = (): HttpResponse => ({
  statusCode: HttpStatusCodes.noContent,
  body: null,
});

export const badRequestResponse = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCodes.badRequest,
  body: error,
});

export const unauthorizedResponse = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCodes.unauthorized,
  body: error,
});

export const notFoundResponse = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCodes.notFound,
  body: error,
});

export const serverErrorResponse = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCodes.serverError,
  body: new Error("Internal server error"),
  debug: error.message,
});
