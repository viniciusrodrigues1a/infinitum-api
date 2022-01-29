import { IDateProvider } from "@shared/presentation/interfaces/providers";
import { format, Locale } from "date-fns";

export class DateFnsDateProvider implements IDateProvider {
  constructor(private readonly locale: Locale) {}

  getFullDate(date: Date): string {
    return format(date, "MMM d, y", {
      locale: this.locale,
    });
  }
}
