import { InvalidEmailError } from "@modules/account/entities/errors";
import { CreateAccountUseCase } from "@modules/account/use-cases";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import {
  CreateAccountController,
  CreateAccountControllerRequest,
} from "./CreateAccountController";

function makeSut() {
  const createAccountUseCaseMock = mock<CreateAccountUseCase>();
  const sut = new CreateAccountController(createAccountUseCaseMock);

  return { sut, createAccountUseCaseMock };
}

describe("createAccount controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(1);

    const { sut } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
    };

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
  });

  it("should return HttpStatusCodes.serverError when unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, createAccountUseCaseMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
    };
    createAccountUseCaseMock.create.mockImplementationOnce(() => {
      throw new Error("Supposedly unhandled server side error");
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });

  it("should return HttpStatusCodes.badRequest when EmailAlreadyInUseError is thrown", async () => {
    expect.assertions(2);

    const { sut, createAccountUseCaseMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "jorge@email.com",
    };
    const errorThrown = new EmailAlreadyInUseError(request.email);
    createAccountUseCaseMock.create.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(errorThrown);
  });

  it("should return HttpStatusCodes.badRequest when InvalidEmailError is thrown", async () => {
    expect.assertions(2);

    const { sut, createAccountUseCaseMock } = makeSut();
    const request: CreateAccountControllerRequest = {
      name: "Jorge",
      email: "notanemail",
    };
    createAccountUseCaseMock.create.mockImplementationOnce(() => {
      throw new InvalidEmailError();
    });

    const response = await sut.handleRequest(request);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(response.body).toStrictEqual(new InvalidEmailError());
  });
});
