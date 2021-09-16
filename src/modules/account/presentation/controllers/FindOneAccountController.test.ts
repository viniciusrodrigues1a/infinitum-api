import { AccountNotFoundError } from "@modules/account/use-cases/errors/AccountNotFoundError";
import { FindOneAccountUseCase } from "@modules/account/use-cases/FindOneAccountUseCase";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { ILanguage } from "main/adapters/utils";
import { FindOneAccountController } from "./FindOneAccountController";

const languageMock = mock<ILanguage>();
languageMock.getAccountNotFoundErrorMessage.mockReturnValueOnce(
  "mocked error msg"
);

function makeSut() {
  const findOneAccountUseCaseMock = mock<FindOneAccountUseCase>();
  const sut = new FindOneAccountController(findOneAccountUseCaseMock);

  return { sut, findOneAccountUseCaseMock };
}

describe("findOneAccount controller", () => {
  it("should return HttpStatusCodes.ok", async () => {
    expect.assertions(2);

    const { sut, findOneAccountUseCaseMock } = makeSut();
    const existentAccount = { name: "Jorge", email: "jorge@email.com" };
    findOneAccountUseCaseMock.findOne.mockResolvedValueOnce(existentAccount);

    const response = await sut.handleRequest({ email: existentAccount.email });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(response.body.email).toBe(existentAccount.email);
  });

  it("should return HttpStatusCodes.notFound", async () => {
    expect.assertions(2);

    const { sut, findOneAccountUseCaseMock } = makeSut();
    const accountEmail = "jorge@email.com";
    findOneAccountUseCaseMock.findOne.mockImplementationOnce(() => {
      throw new AccountNotFoundError(accountEmail, languageMock);
    });

    const response = await sut.handleRequest({ email: accountEmail });

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
    expect(response.body).toBeInstanceOf(AccountNotFoundError);
  });

  it("should return HttpStatusCodes.serverError", async () => {
    expect.assertions(1);

    const { sut, findOneAccountUseCaseMock } = makeSut();
    findOneAccountUseCaseMock.findOne.mockImplementationOnce(() => {
      throw new Error("unhandled server side error");
    });

    const response = await sut.handleRequest({ email: "jorge@email.com" });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
