import { ILoginRepository } from "@modules/account/infra/repositories";
import { InvalidCredentialsError } from "@modules/account/infra/repositories/errors/InvalidCredentialsError";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IAccountLanguage } from "../languages";
import { LoginController } from "./LoginController";

const languageMock = mock<IAccountLanguage>();

function makeSut() {
  const loginRepositoryMock = mock<ILoginRepository>();
  const sut = new LoginController(loginRepositoryMock);

  return { sut, loginRepositoryMock };
}

describe("login controller", () => {
  it("should return HttpStatusCodes.ok", async () => {
    expect.assertions(2);

    const { sut, loginRepositoryMock } = makeSut();
    const token = "my-auth-token";
    loginRepositoryMock.login.mockResolvedValueOnce(token);

    const response = await sut.handleRequest({
      email: "jorge@email.com",
      password: "mypa55word",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(response.body.token).toBe(token);
  });

  it("should return HttpStatusCodes.badRequest when InvalidCredentialsError is thrown", async () => {
    expect.assertions(2);

    const { sut, loginRepositoryMock } = makeSut();
    loginRepositoryMock.login.mockImplementationOnce(() => {
      throw new InvalidCredentialsError(languageMock);
    });

    const response = await sut.handleRequest({
      email: "jorge@email.com",
      password: "mypa55word",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(InvalidCredentialsError);
  });

  it("should return HttpStatusCodes.serverError when unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, loginRepositoryMock } = makeSut();
    loginRepositoryMock.login.mockImplementationOnce(() => {
      throw new Error("Server side error");
    });

    const response = await sut.handleRequest({
      email: "jorge@email.com",
      password: "mypa55word",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
