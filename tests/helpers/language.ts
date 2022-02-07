import { DateFnsDateProvider } from "@shared/infra/providers/DateFnsDateProvider";
import { PTBRLanguage } from "@shared/presentation/languages";
import { ptBR } from "date-fns/locale";

export const defaultLanguage = new PTBRLanguage(new DateFnsDateProvider(ptBR));
