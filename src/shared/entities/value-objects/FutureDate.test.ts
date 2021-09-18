import { mock } from "jest-mock-extended";
import { NotFutureDateError } from "../errors";
import { INotFutureDateErrorLanguage } from "../interfaces/languages";
import { FutureDate } from "./FutureDate";

const notFutureDateErrorLanguageMock = mock<INotFutureDateErrorLanguage>();
notFutureDateErrorLanguageMock.getNotFutureDateErrorMessage.mockReturnValue(
  "mocked error message"
);

describe("class FutureDate constructor", () => {
  it("should accept future date", () => {
    expect.assertions(1);

    const nowMs = new Date().getTime();
    const givenDate = new Date(nowMs * 2);

    const date = new FutureDate(givenDate, notFutureDateErrorLanguageMock);

    expect(date.value).toBe(givenDate);
  });

  it("should throw NotFutureDateError if date is in the past", () => {
    expect.assertions(1);

    const nowMs = new Date().getTime();
    const daySeconds = 86400;
    const dayMs = daySeconds * 1000;
    const givenDate = new Date(nowMs - dayMs);

    const when = () =>
      new FutureDate(givenDate, notFutureDateErrorLanguageMock);

    expect(when).toThrow(
      new NotFutureDateError(givenDate, notFutureDateErrorLanguageMock)
    );
  });
});
