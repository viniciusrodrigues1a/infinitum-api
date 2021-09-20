import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import * as FutureDateModule from "@shared/entities/value-objects/FutureDate";
import { mock } from "jest-mock-extended";
import { BeginsAtMustBeBeforeFinishesAtError } from "./errors";
import { IBeginsAtMustBeBeforeFinishesAtErrorLanguage } from "./interfaces/languages";
import { Project } from "./Project";

const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
  "mocked error message"
);
const beginsAtMustBeBeforeFinishesAtErrorLanguageMock =
  mock<IBeginsAtMustBeBeforeFinishesAtErrorLanguage>();
beginsAtMustBeBeforeFinishesAtErrorLanguageMock.getBeginsAtMustBeBeforeFinishesAtErrorMessage.mockReturnValue(
  "mocked error message"
);

describe("entity Project constructor", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should instantiate FutureDate to validate finishesAt", () => {
    expect.assertions(2);

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

    const project = new Project(
      givenProject,
      notFutureDateErrorLanguageMock,
      beginsAtMustBeBeforeFinishesAtErrorLanguageMock
    );

    expect(futureDateSpy).toHaveBeenNthCalledWith(
      1,
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
    const givenProject = {
      name: "new project",
      description: "my new project",
      finishesAt: new Date(),
    };

    const when = () =>
      new Project(
        givenProject,
        notFutureDateErrorLanguageMock,
        beginsAtMustBeBeforeFinishesAtErrorLanguageMock
      );

    expect(when).toThrow(errorThrown);
  });

  it("should not instantiate FutureDate if finishesAt is undefined", () => {
    expect.assertions(2);

    const futureDateSpy = jest.spyOn(FutureDateModule, "FutureDate");
    const givenProject = {
      name: "new project",
      description: "my new project",
      finishesAt: undefined,
    };

    const project = new Project(
      givenProject,
      notFutureDateErrorLanguageMock,
      beginsAtMustBeBeforeFinishesAtErrorLanguageMock
    );

    expect(futureDateSpy).toHaveBeenCalledTimes(0);
    expect(project.finishesAt).toBeUndefined();
  });

  it("should throw BeginsAtMustBeBeforeFinishesAtError if project begins after being finished", () => {
    expect.assertions(1);

    const nowMs = new Date().getTime();
    const oneDayMs = 86400 * 1000;
    const inFiveDays = new Date(nowMs + oneDayMs * 5);
    const inTwoDays = new Date(nowMs + oneDayMs * 2);
    const givenProject = {
      name: "new project",
      description: "my new project",
      beginsAt: inFiveDays,
      finishesAt: inTwoDays,
    };

    const when = () =>
      new Project(
        givenProject,
        notFutureDateErrorLanguageMock,
        beginsAtMustBeBeforeFinishesAtErrorLanguageMock
      );

    expect(when).toThrow(
      new BeginsAtMustBeBeforeFinishesAtError(
        beginsAtMustBeBeforeFinishesAtErrorLanguageMock
      )
    );
  });
});
