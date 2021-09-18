import { Operation } from "./Operation";
import { Participant } from "./Participant";
import { RoleNameType } from "./type-defs";

describe("value-object Participant.can method", () => {
  it("should return false if role doesn't have that permission", () => {
    expect.assertions(1);

    const givenOperation = "UPDATE_OPERATION" as Operation;
    const account = { name: "jorge", email: "jorge@email.com" };
    const role = {
      name: "member" as RoleNameType,
      permissions: ["LIST_OPERATION" as Operation],
    };
    const participant = new Participant(account, role);

    const can = participant.can(givenOperation);

    expect(can).toBe(false);
  });

  it("should return true if role has that permission", () => {
    expect.assertions(1);

    const givenOperation = "UPDATE_OPERATION" as Operation;
    const account = { name: "jorge", email: "jorge@email.com" };
    const role = {
      name: "admin" as RoleNameType,
      permissions: ["UPDATE_OPERATION" as Operation],
    };
    const participant = new Participant(account, role);

    const can = participant.can(givenOperation);

    expect(can).toBe(true);
  });
});
