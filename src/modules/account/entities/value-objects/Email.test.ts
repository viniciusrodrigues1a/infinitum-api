import { mock } from "jest-mock-extended";
import { InvalidEmailError } from "../errors";
import { IInvalidEmailErrorLanguage } from "../interfaces/languages";
import { Email } from "./Email";

const invalidEmailErrorLanguageMock = mock<IInvalidEmailErrorLanguage>();
invalidEmailErrorLanguageMock.getInvalidEmailErrorMessage.mockReturnValue(
  "Email is invalid"
);

describe("email.isEmailValid method", () => {
  it("should accept valid email", () => {
    expect.assertions(1);

    const givenEmail = "jorge@email.com";

    const email = new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(email.value).toBe(givenEmail);
  });

  it("should not accept email without the at-sign", () => {
    expect.assertions(1);

    const givenEmail = "jorgeemail.com";

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept more than 64 chars in the username part", () => {
    expect.assertions(1);

    const username = "c".repeat(100);
    const givenEmail = `${username}@email.com`;

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept empty username part", () => {
    expect.assertions(1);

    const givenEmail = "@email.com";

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept invalid char in the username part", () => {
    expect.assertions(1);

    const givenEmail = "jor ge@email.com";

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept a dot as first char of username part", () => {
    expect.assertions(1);

    const givenEmail = ".jorge@email.com";

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept a dot as last char of username part", () => {
    expect.assertions(1);

    const givenEmail = "jorge.@email.com";

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept more than 255 chars in the domain part", () => {
    expect.assertions(1);

    const domain = "c".repeat(200);
    const givenEmail = `jorge@${domain}.com`;

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });

  it("should not accept dot as first char of domain part", () => {
    expect.assertions(1);

    const givenEmail = `jorge@.email.com`;

    const when = () => new Email(givenEmail, invalidEmailErrorLanguageMock);

    expect(when).toThrow(new InvalidEmailError(invalidEmailErrorLanguageMock));
  });
});
