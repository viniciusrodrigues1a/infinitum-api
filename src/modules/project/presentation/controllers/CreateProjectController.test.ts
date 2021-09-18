import {CreateProjectUseCase} from "@modules/project/use-cases";
import {HttpStatusCodes} from "@shared/presentation/http/HttpStatusCodes";
import {mock} from "jest-mock-extended";
import {CreateProjectController} from "./CreateProjectController";

function makeSut() {
  const createProjectUseCaseMock = mock<CreateProjectUseCase>();
  const sut = new CreateProjectController(createProjectUseCaseMock);

  return {sut, createProjectUseCaseMock};
}
describe("createProject controller", () => {
  it("should return HttpStatusCodes.noContent", async () => {
    expect.assertions(2);

    const {sut, createProjectUseCaseMock} = makeSut();
    const givenProject = {
      name: "my project",
      description: "my project's description",
      accountEmailRequestingCreation: "jorge@email.com",
    };

    const response = await sut.handleRequest(givenProject);

    expect(response.statusCode).toBe(HttpStatusCodes.noContent);
    expect(createProjectUseCaseMock.create).toHaveBeenNthCalledWith(
      1,
      givenProject
    );
  });
});
