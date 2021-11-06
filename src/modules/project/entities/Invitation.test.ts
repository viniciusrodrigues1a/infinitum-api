import { mock } from "jest-mock-extended";
import { OwnerCantBeUsedAsARoleForAnInvitationError } from "./errors/OwnerCantBeUsedAsARoleForAnInvitationError";
import {
  IInvalidRoleNameErrorLanguage,
  IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage,
} from "./interfaces/languages";
import { Invitation } from "./Invitation";
import { Role } from "./value-objects";

const invalidRoleNameErrorLanguageMock = mock<IInvalidRoleNameErrorLanguage>();
const ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock =
  mock<IOwnerCantBeUsedAsARoleForAnInvitationErrorLanguage>();

describe("entity Invitation constructor", () => {
  it("should throw OwnerCantBeUsedAsARoleForAnInvitationError if the owner role is given", async () => {
    expect.assertions(1);

    const givenInvitation = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      role: new Role("owner", invalidRoleNameErrorLanguageMock),
    };

    const when = () =>
      new Invitation(
        givenInvitation,
        ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock
      );

    expect(when).toThrow(OwnerCantBeUsedAsARoleForAnInvitationError);
  });

  it("should generate an invitation with a token", async () => {
    expect.assertions(1);

    const givenInvitation = {
      projectId: "project-id-0",
      accountEmail: "jorge@email.com",
      role: new Role("member", invalidRoleNameErrorLanguageMock),
    };

    const invitation = new Invitation(
      givenInvitation,
      ownerCantBeUsedAsARoleForAnInvitationErrorLanguageMock
    );

    expect(invitation).toHaveProperty("token");
  });
});
