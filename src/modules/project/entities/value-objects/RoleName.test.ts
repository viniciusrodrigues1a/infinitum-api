import { mock } from "jest-mock-extended";
import { InvalidRoleNameError } from "../errors/InvalidRoleNameError";
import { IInvalidRoleNameErrorLanguage } from "../interfaces/languages";
import { RoleName } from "./RoleName";

const invalidRoleNameErrorLanguageMock = mock<IInvalidRoleNameErrorLanguage>();
invalidRoleNameErrorLanguageMock.getInvalidRoleNameErrorLanguage.mockReturnValue(
  "mocked error message"
);

describe("roleName value-object", () => {
  it("should be able to instantiate RoleName with a valid name", () => {
    expect.assertions(1);

    const name = "member";

    const roleName = new RoleName(name, invalidRoleNameErrorLanguageMock);

    expect(roleName.value).toBe(name);
  });

  it("should throw InvalidRoleNameError if name is invalid", () => {
    expect.assertions(1);

    const name = "invalid-role";

    const when = () => new RoleName(name, invalidRoleNameErrorLanguageMock);

    expect(when).toThrow(
      new InvalidRoleNameError(name, invalidRoleNameErrorLanguageMock)
    );
  });
});
