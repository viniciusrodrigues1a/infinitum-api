import { IAuthorizationMiddlewareLanguage } from "./IAuthorizationMiddlewareLanguage";

export class PTBRAuthorizationMiddlewareLanguage
  implements IAuthorizationMiddlewareLanguage
{
  getMissingAuthorizationHeaderMessage(): string {
    return "O token não foi especificado";
  }

  getUnauthorizedMessage(): string {
    return "Token especificado não é válido";
  }
}
