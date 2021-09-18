import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import * as FutureDateModule from "@shared/entities/value-objects/FutureDate";
import { mock } from "jest-mock-extended";
import { Project } from "./Project";

jest.mock("@shared/entities/value-objects/FutureDate");
const { FutureDate } = FutureDateModule;

const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
  "mocked error message"
);

describe("entity Project constructor", () => {
  it("should instantiate FutureDate to validate finishesAt", () => {
    expect.assertions(3);

    const futureDateSpy = jest.spyOn(FutureDateModule, "FutureDate");
    /*
     * Disabling typescript because it would yell the error:
     * `Property 'isDateValid' is private in type 'FutureDate' but not in type '{ value: Date; isDateValid: (_date) => true; }'`
     * but isDateValid can't be made private in the object below
     */
    /* eslint-disable-next-line  @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    futureDateSpy.mockImplementationOnce((date, _language) => ({
      value: date,
      isDateValid: (_date) => true,
    }));
    const finishesAt = new Date();
    const givenProject = {
      name: "new project",
      description: "my new project",
      finishesAt,
    };

    const project = new Project(givenProject, notFutureDateErrorLanguageMock);

    expect(FutureDate).toHaveBeenCalledTimes(1);
    expect(FutureDate).toHaveBeenCalledWith(
      givenProject.finishesAt,
      notFutureDateErrorLanguageMock
    );
    expect(project.finishesAt).toBe(givenProject.finishesAt);
  });

  it("should throw an error if FutureDate throws one", () => {
    expect.assertions(1);

    const futureDateSpy = jest.spyOn(FutureDateModule, "FutureDate");
    const errorThrown = new Error("FutureDate.constructor threw");
    futureDateSpy.mockImplementationOnce((_date, _language) => {
      throw errorThrown;
    });
    const finishesAt = new Date();
    const givenProject = {
      name: "new project",
      description: "my new project",
      finishesAt,
    };

    const when = () =>
      new Project(givenProject, notFutureDateErrorLanguageMock);

    expect(when).toThrow(errorThrown);
  });

  it("should not instantiate FutureDate if finishesAt is undefined", () => {
    expect.assertions(2);

    const givenProject = {
      name: "new project",
      description: "my new project",
      finishesAt: undefined,
    };

    const project = new Project(givenProject, notFutureDateErrorLanguageMock);

    expect(FutureDate).toHaveBeenCalledTimes(0);
    expect(project.finishesAt).toBeUndefined();
  });
});
