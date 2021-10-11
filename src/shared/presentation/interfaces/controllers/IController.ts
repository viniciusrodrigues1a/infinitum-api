import { HttpResponse } from "@shared/presentation/http/HttpResponse";

export interface IController {
  handleRequest(request: any): Promise<HttpResponse>;
}
