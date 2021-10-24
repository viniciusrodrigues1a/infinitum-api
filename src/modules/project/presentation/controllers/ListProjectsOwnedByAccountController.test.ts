import { Project } from "@modules/project/entities";
import { ListProjectsOwnedByAccountUseCase } from "@modules/project/use-cases/ListProjectsOwnedByAccountUseCase";
import { HttpStatusCodes } from "@shared/presentation/http/HttpStatusCodes";
import { mock } from "jest-mock-extended";
import { ListProjectsOwnedByAccountController } from "./ListProjectsOwnedByAccountController";

function makeSut() {
  const listProjectsOwnedByAccountUseCaseMock =
    mock<ListProjectsOwnedByAccountUseCase>();
  const sut = new ListProjectsOwnedByAccountController(
    listProjectsOwnedByAccountUseCaseMock
  );

  return { sut, listProjectsOwnedByAccountUseCaseMock };
}

describe("listProjectsOwnedByAccount controller", () => {
  it("should return status HttpStatusCodes.ok and body with array", async () => {
    expect.assertions(2);

    const { sut, listProjectsOwnedByAccountUseCaseMock } = makeSut();
    const mockedProject = { projectId: "project-id-0" } as Project;
    listProjectsOwnedByAccountUseCaseMock.list.mockResolvedValueOnce([
      mockedProject,
    ]);
    const givenEmail = "jorge@email.com";

    const response = await sut.handleRequest({
      accountEmailMakingRequest: givenEmail,
    });

    expect(response.statusCode).toBe(HttpStatusCodes.ok);
    expect(listProjectsOwnedByAccountUseCaseMock.list).toHaveBeenCalledWith(
      givenEmail
    );
  });

  it("should return status HttpStatusCodes.serverError if unhandled error is thrown", async () => {
    expect.assertions(1);

    const { sut, listProjectsOwnedByAccountUseCaseMock } = makeSut();
    listProjectsOwnedByAccountUseCaseMock.list.mockImplementationOnce(() => {
      throw new Error("unhandled server side err");
    });

    const response = await sut.handleRequest({
      accountEmailMakingRequest: "jorge@email.com",
    });

    expect(response.statusCode).toBe(HttpStatusCodes.serverError);
  });
});
