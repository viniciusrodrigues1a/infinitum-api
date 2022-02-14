import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import {
  IUpdateAccountImageRepository,
  IUpdateAccountRepository,
} from "../interfaces/repositories";
import {
  UpdateAccountController,
  UpdateAccountControllerRequest,
} from "./UpdateAccountController";

function makeSut() {
  const updateAccountRepositoryMock = mock<IUpdateAccountRepository>();
  const updateAccountImageRepositoryMock =
    mock<IUpdateAccountImageRepository>();
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const emailAlreadyInUseErrorLanguageMock =
    mock<IEmailAlreadyInUseErrorLanguage>();
  const sut = new UpdateAccountController(
    updateAccountRepositoryMock,
    updateAccountImageRepositoryMock,
    doesAccountExistRepositoryMock,
    emailAlreadyInUseErrorLanguageMock
  );

  return {
    sut,
    updateAccountRepositoryMock,
    updateAccountImageRepositoryMock,
    doesAccountExistRepositoryMock,
    emailAlreadyInUseErrorLanguageMock,
  };
}

describe("update account controller", () => {
  it("should return HttpStatusCodes.noContent and call the repositories", async () => {
    expect.assertions(3);

    const {
      sut,
      updateAccountRepositoryMock,
      updateAccountImageRepositoryMock,
      doesAccountExistRepositoryMock,
    } = makeSut();
    const givenRequest: UpdateAccountControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      name: "Julio",
      email: "julio@email.com",
      password: "newpa55",
      fileBuffer: Buffer.from("image-content"),
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(updateAccountRepositoryMock.updateAccount).toHaveBeenCalledTimes(1);
    expect(
      updateAccountImageRepositoryMock.updateAccountImage
    ).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.noContent and call only the IUpdateAccountRepository since fileBuffer is undefined", async () => {
    expect.assertions(3);

    const {
      sut,
      updateAccountRepositoryMock,
      updateAccountImageRepositoryMock,
      doesAccountExistRepositoryMock,
    } = makeSut();
    const givenRequest: UpdateAccountControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      name: "Julio",
      email: "julio@email.com",
      password: "newpa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(updateAccountRepositoryMock.updateAccount).toHaveBeenCalledTimes(1);
    expect(
      updateAccountImageRepositoryMock.updateAccountImage
    ).toHaveBeenCalledTimes(0);
  });

  it("should return HttpStatusCodes.badRequest if email is already in use", async () => {
    expect.assertions(2);

    const { sut, doesAccountExistRepositoryMock } = makeSut();
    const givenRequest: UpdateAccountControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      name: "Julio",
      email: "julio@email.com",
      password: "newpa55",
    };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.badRequest);
    expect(
      doesAccountExistRepositoryMock.doesAccountExist
    ).toHaveBeenCalledWith(givenRequest.email);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, updateAccountRepositoryMock } = makeSut();
    const givenRequest: UpdateAccountControllerRequest = {
      accountEmailMakingRequest: "jorge@email.com",
      name: "Julio",
      email: "julio@email.com",
      password: "newpa55",
    };
    updateAccountRepositoryMock.updateAccount.mockImplementationOnce(() => {
      throw new Error("unhandled server-side err");
    });

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
