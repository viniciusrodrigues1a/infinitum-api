export interface IAuthorizationMiddlewareLanguage {
  getMissingAuthorizationHeaderMessage(): string;
  getUnauthorizedMessage(): string;
}
