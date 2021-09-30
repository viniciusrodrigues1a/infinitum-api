import { IRoleInsufficientPermissionErrorLanguage } from "../interfaces/languages/IRoleInsufficientPermissionErrorLanguage";

export class RoleInsufficientPermissionError extends Error {
  constructor(
    roleIdentifier: string,
    language: IRoleInsufficientPermissionErrorLanguage
  ) {
    const message =
      language.getRoleInsufficientPermissionErrorMessage(roleIdentifier);
    super(message);
    this.message = message;
  }
}
