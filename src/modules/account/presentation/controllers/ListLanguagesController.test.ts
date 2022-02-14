import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IListLanguagesRepository } from "../interfaces/repositories";
import { ListLanguagesController } from "./ListLanguagesController";

function makeSut() {
  const listLanguagesRepositoryMock = mock<IListLanguagesRepository>();
  const sut = new ListLanguagesController(listLanguagesRepositoryMock);

  return { sut, listLanguagesRepositoryMock };
}

describe("list all languages controller", () => {
  it("should return HttpStatusCode.ok", async () => {
    expect.assertions(2);

    const { sut, listLanguagesRepositoryMock } = makeSut();
    const languages = [
      { id: "id-0", isoCode: "ptBR", displayName: "Português (Brasil)" },
      { id: "id-1", isoCode: "enUS", displayName: "English (United States)" },
    ];
    listLanguagesRepositoryMock.listLanguages.mockResolvedValueOnce(languages);

    const response = await sut.handleRequest();

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(response.body).toBe(languages);
  });

  it("should return HttpStatusCode.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, listLanguagesRepositoryMock } = makeSut();
    listLanguagesRepositoryMock.listLanguages.mockImplementationOnce(() => {
      throw new Error("unhandled server-side err");
    });

    const response = await sut.handleRequest();

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
