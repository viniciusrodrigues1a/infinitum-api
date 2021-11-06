import crypto from "crypto";
import { InvitationDTO } from "./DTOs";
import { OwnerCantBeUsedAsARoleForAnInvitationError } from "./errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import { IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage } from "./interfaces/languages";
import { InvitationToken, Role } from "./value-objects";

export class Invitation {
  projectId: string;
  accountEmail: string;
  role: Role;
  token: InvitationToken;

  constructor(
    { projectId, accountEmail, role }: InvitationDTO,
    language: IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage
  ) {
    if (role.name.value === "owner") {
      throw new OwnerCantBeUsedAsARoleForAnInvitationError(language);
    }

    this.projectId = projectId;
    this.accountEmail = accountEmail;
    this.role = role;
    this.token = this.generateToken();
  }

  private generateToken(): string {
    const timezone = new Date().toISOString().split("T")[1];
    const timezoneToHex = Buffer.from(timezone).toString("hex");
    const randomHex = crypto.randomBytes(8).toString("hex");

    return timezoneToHex + randomHex;
  }
}
