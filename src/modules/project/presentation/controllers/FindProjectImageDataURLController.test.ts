import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IFindProjectImageBufferRepository } from "../interfaces/repositories";
import { FindProjectImageDataURLController } from "./FindProjectImageDataURLController";

function makeSut() {
  const findProjectImageBufferRepositoryMock =
    mock<IFindProjectImageBufferRepository>();
  const sut = new FindProjectImageDataURLController(
    findProjectImageBufferRepositoryMock
  );

  return { sut, findProjectImageBufferRepositoryMock };
}

describe("findProjectImageBuffer controller", () => {
  it("should return HttpStatusCodes.ok and the image data url", async () => {
    expect.assertions(2);

    const { sut, findProjectImageBufferRepositoryMock } = makeSut();
    const mockedBuffer = Buffer.from("file content");
    findProjectImageBufferRepositoryMock.findProjectImageBuffer.mockResolvedValueOnce(
      mockedBuffer
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    const dataURL = `data:image/*;base64,${mockedBuffer.toString("base64")}`;
    expect(response.body.dataURL).toBe(dataURL);
  });

  it("should return HttpStatusCodes.notFound", async () => {
    expect.assertions(1);

    const { sut, findProjectImageBufferRepositoryMock } = makeSut();
    findProjectImageBufferRepositoryMock.findProjectImageBuffer.mockResolvedValueOnce(
      undefined
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.notFound);
  });

  it("should return HttpStatusCodes.serverError", async () => {
    expect.assertions(1);

    const { sut, findProjectImageBufferRepositoryMock } = makeSut();
    findProjectImageBufferRepositoryMock.findProjectImageBuffer.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );

    const response = await sut.handleRequest({ projectId: "project-id-0" });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
