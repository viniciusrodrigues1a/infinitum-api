import { InvalidEmailError } from "@modules/account/entities/errors";
import { IRegisterAccountRepository } from "@modules/account/infra/repositories";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { ILanguage } from "../languages/ILanguage";
import {
  CreateAccountController,
  CreateAccountControllerRequest,
} from "./CreateAccountController";

function makeSut() {
  const registerAccountRepositoryMock = mock<IRegisterAccountRepository>();
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const languageMock = mock<ILanguage>();
  const sut = new CreateAccountController(
    registerAccountRepositoryMock,
    doesAccountExistRepositoryMock,
    languageMock
  );

  return {
    sut,
    registerAccountRepositoryMock,
    doesAccountExistRepositoryMock,
    languageMock,
  };
}

describe("createAccount controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
  });

  it("should return HttpStatusCodes.serverError when unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, registerAccountRepositoryMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    registerAccountRepositoryMock.create.mockImplementationOnce(() => {
      throw new Error("Supposedly unhandled server side error");
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.badRequest when Account already exists", async () => {
    expect.assertions(2);

    const { sut, doesAccountExistRepositoryMock, languageMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(
      new EmailAlreadyInUseError(request.email, languageMock)
    );
  });

  it("should return HttpStatusCodes.badRequest when InvalidEmailError is thrown", async () => {
    expect.assertions(2);

    const { sut, languageMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "notanemail",
      password: "pa55",
    };

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(new InvalidEmailError(languageMock));
  });
});
