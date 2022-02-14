import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IFindProjectImageDataURLRepository } from "../interfaces/repositories";
import { FindProjectImageDataURLController } from "./FindProjectImageDataURLController";

function makeSut() {
  const findProjectImageDataURLRepositoryMock =
    mock<IFindProjectImageDataURLRepository>();
  const sut = new FindProjectImageDataURLController(
    findProjectImageDataURLRepositoryMock
  );

  return {
    sut,
    findProjectImageDataURLRepositoryMock,
  };
}

describe("findProjectImageBuffer controller", () => {
  it("should return HttpStatusCodes.ok and the image data url", async () => {
    expect.assertions(2);

    const { sut, findProjectImageDataURLRepositoryMock } = makeSut();
    const dataURL = `data:image/*;base64,${Buffer.from("file content").toString(
      "base64"
    )}`;
    findProjectImageDataURLRepositoryMock.findProjectImageDataURL.mockResolvedValueOnce(
      dataURL
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(response.body.dataURL).toBe(dataURL);
  });

  it("should return HttpStatusCodes.notFound", async () => {
    expect.assertions(1);

    const { sut, findProjectImageDataURLRepositoryMock } = makeSut();
    findProjectImageDataURLRepositoryMock.findProjectImageDataURL.mockResolvedValueOnce(
      undefined
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.serverError", async () => {
    expect.assertions(1);

    const { sut, findProjectImageDataURLRepositoryMock } = makeSut();
    findProjectImageDataURLRepositoryMock.findProjectImageDataURL.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
