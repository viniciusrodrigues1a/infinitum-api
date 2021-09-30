import { mock } from "jest-mock-extended";
import { IInvalidRoleNameErrorLanguage } from "../interfaces/languages";
import { Operation } from "./Operation";
import { Participant } from "./Participant";
import { Role } from "./Role";
import { RoleNameType } from "./type-defs";

const invalidRoleNameErrorLanguageMock = mock<IInvalidRoleNameErrorLanguage>();

describe("value-object Participant.can method", () => {
  it("should return false if role doesn't have that permission", () => {
    expect.assertions(1);

    const givenOperation = "UPDATE_OPERATION" as Operation;
    const account = { name: "jorge", email: "jorge@email.com" };
    const role = new Role("member", invalidRoleNameErrorLanguageMock);
    role.permissions = [];
    const participant = new Participant(account, role);

    const can = participant.role.can(givenOperation);

    expect(can).toBe(false);
  });

  it("should return true if role has that permission", () => {
    expect.assertions(1);

    const givenOperation = "UPDATE_OPERATION" as Operation;
    const account = { name: "jorge", email: "jorge@email.com" };
    const role = new Role("member", invalidRoleNameErrorLanguageMock);
    role.permissions = [givenOperation];
    const participant = new Participant(account, role);

    const can = participant.role.can(givenOperation);

    expect(can).toBe(true);
  });
});
