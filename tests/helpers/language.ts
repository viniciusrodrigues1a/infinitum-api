import { PTBRLanguage } from "@modules/account/presentation/languages";
import { DateFnsDateProvider } from "@shared/infra/providers/DateFnsDateProvider";
import { ptBR } from "date-fns/locale";

export const defaultLanguage = new PTBRLanguage(new DateFnsDateProvider(ptBR));
