import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { IUpdateProjectImageRepository } from "../interfaces/repositories";
import { UpdateProjectImageController } from "./UpdateProjectImageController";

function makeSut() {
  const updateProjectImageRepositoryMock =
    mock<IUpdateProjectImageRepository>();
  const sut = new UpdateProjectImageController(
    updateProjectImageRepositoryMock
  );

  return { sut, updateProjectImageRepositoryMock };
}

describe("updateProjectImage controller", () => {
  it("should return HttpStatusCodes.noContent and call the repository", async () => {
    expect.assertions(2);

    const { sut, updateProjectImageRepositoryMock } = makeSut();
    const givenRequest = {
      projectId: "project-id-0",
      fileBuffer: Buffer.from("image content"),
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(
      updateProjectImageRepositoryMock.updateProjectImage
    ).toHaveBeenCalledTimes(1);
  });

  it("should return HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, updateProjectImageRepositoryMock } = makeSut();
    updateProjectImageRepositoryMock.updateProjectImage.mockImplementationOnce(
      () => {
        throw new Error("unhandled server side err");
      }
    );
    const givenRequest = {
      projectId: "project-id-0",
      fileBuffer: Buffer.from("image content"),
    };

    const response = await sut.handleRequest(givenRequest);

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
