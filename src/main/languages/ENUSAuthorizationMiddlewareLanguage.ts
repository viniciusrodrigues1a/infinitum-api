import { IAuthorizationMiddlewareLanguage } from "./IAuthorizationMiddlewareLanguage";

export class ENUSAuthorizationMiddlewareLanguage
  implements IAuthorizationMiddlewareLanguage
{
  getMissingAuthorizationHeaderMessage(): string {
    return "Token was not provided";
  }

  getUnauthorizedMessage(): string {
    return "Token provided is not valid";
  }
}
