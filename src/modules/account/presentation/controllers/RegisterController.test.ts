import { InvalidEmailError } from "@modules/account/entities/errors";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { IValidation } from "@shared/presentation/validation";
import { mock } from "jest-mock-extended";
import { IRegisterRepository } from "../interfaces/repositories";
import { ILanguage } from "../languages";
import {
  RegisterController,
  RegisterControllerRequest,
} from "./RegisterController";

const languageMock = mock<ILanguage>();

function makeSut() {
  const registerAccountRepositoryMock = mock<IRegisterRepository>();
  const validationMock = mock<IValidation>();
  const sut = new RegisterController(
    registerAccountRepositoryMock,
    validationMock
  );

  return {
    sut,
    registerAccountRepositoryMock,
    validationMock,
  };
}

describe("register controller", () => {
  it("should return HttpStatusCodes.badRequest if validation returns an error", async () => {
    expect.assertions(2);

    const { sut, validationMock } = makeSut();
    const request: RegisterControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    const errReturned = new Error("Validation error");
    validationMock.validate.mockImplementationOnce(() => errReturned);

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBe(errReturned);
  });

  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const request: RegisterControllerRequest = {
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
    const request: RegisterControllerRequest = {
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

    const { sut, registerAccountRepositoryMock } = makeSut();
    const request: RegisterControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
      password: "pa55",
    };
    registerAccountRepositoryMock.create.mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(request.email, languageMock);
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should return HttpStatusCodes.badRequest when InvalidEmailError is thrown", async () => {
    expect.assertions(2);

    const { sut, registerAccountRepositoryMock } = makeSut();
    const request: RegisterControllerRequest = {
      name: "Jorge",
      email: "notanemail",
      password: "pa55",
    };
    registerAccountRepositoryMock.create.mockImplementationOnce(() => {
      throw new InvalidEmailError(languageMock);
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });
});
