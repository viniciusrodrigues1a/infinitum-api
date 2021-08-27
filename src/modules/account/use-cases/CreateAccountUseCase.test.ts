import { mock } from "jest-mock-extended";
import { InvalidEmailError } from "../entities/errors";
import { CreateAccountUseCase } from "./CreateAccountUseCase";
import { EmailAlreadyInUseError } from "./errors";
import { IDoesAccountExistRepository } from "./interfaces/repositories";
import { ICreateAccountRepository } from "./interfaces/repositories/ICreateAccountRepository";

function makeSut() {
  const createAccountRepositoryMock = mock<ICreateAccountRepository>();
  const doesAccountExistRepositoryMock = mock<IDoesAccountExistRepository>();
  const sut = new CreateAccountUseCase(
    createAccountRepositoryMock,
    doesAccountExistRepositoryMock
  );

  return { sut, createAccountRepositoryMock, doesAccountExistRepositoryMock };
}

describe("createAccount use-case", () => {
  it("should create an Account", async () => {
    expect.assertions(1);

    const { sut, createAccountRepositoryMock, doesAccountExistRepositoryMock } =
      makeSut();
    const accountDTO = { name: "Jorge", email: "jorge@email.com" };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    await sut.create(accountDTO);

    expect(createAccountRepositoryMock.create).toHaveBeenNthCalledWith(
      1,
      accountDTO
    );
  });

  it("should NOT be able to create an Account with an invalid email", async () => {
    expect.assertions(1);

    const { sut, doesAccountExistRepositoryMock } = makeSut();
    const accountDTO = { name: "Jorge", email: "notanemail" };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(
      false
    );

    const when = sut.create(accountDTO);

    await expect(when).rejects.toThrow(new InvalidEmailError());
  });

  it("should NOT be able to create an Account if email is already in use", async () => {
    expect.assertions(1);

    const { sut, doesAccountExistRepositoryMock } = makeSut();
    const accountDTO = { name: "Jorge", email: "alreadyinuse@gmail.com" };
    doesAccountExistRepositoryMock.doesAccountExist.mockResolvedValueOnce(true);

    const when = sut.create(accountDTO);

    await expect(when).rejects.toThrow(
      new EmailAlreadyInUseError(accountDTO.email)
    );
  });
});
