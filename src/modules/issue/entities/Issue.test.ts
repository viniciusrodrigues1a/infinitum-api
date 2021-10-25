import { INotFutureDateErrorLanguage } from "@shared/entities/interfaces/languages";
import * as FutureDateModule from "@shared/entities/value-objects/FutureDate";
import { mock } from "jest-mock-extended";
import { Issue } from "./Issue";

const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
  "mocked error message"
);

describe("entity Issue constructor", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should instantiate FutureDate to validate expiresAt", () => {
    expect.assertions(1);

    const futureDateSpy = jest.spyOn(FutureDateModule, "FutureDate");
    const errorThrown = new Error("future date err");
    futureDateSpy.mockImplementationOnce(() => {
      throw errorThrown;
    });

    const when = () =>
      new Issue(
        {
          title: "My issue",
          description: "My issue's description",
          owner: { name: "jorge", email: "jorge@email.com" },
          expiresAt: new Date(),
        },
        notFutureDateErrorLanguageMock
      );

    expect(when).toThrow(errorThrown);
  });
});
