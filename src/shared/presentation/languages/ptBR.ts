import { ILanguage } from "./ILanguage";

export class PTBRLanguage implements ILanguage {
  getBeginsAtMustBeBeforeFinishesAtErrorMessage(): string {
    return "Data de término não pode ser antes da data de começo";
  }

  getMissingParamsErrorNameParamMessage(): string {
    return "nome";
  }

  getMissingParamsErrorDescriptionParamMessage(): string {
    return "descrição";
  }

  getMissingParamsErrorMessage(params: string[]): string {
    return `Você precisa especificar: ${params.join(", ")}`;
  }

  getNotFutureDateErrorMessage(date: Date): string {
    return `Data ${date.toLocaleString()} não pode estar no passado`;
  }

  getInvalidCredentialsErrorMessage(): string {
    return "Email ou senha inválidos";
  }

  getAccountNotFoundErrorMessage(_identifier: string): string {
    return "Conta especificada não existe";
  }

  getInvalidEmailErrorMessage(): string {
    return "Email não é válido";
  }

  getEmailAlreadyInUseErrorMessage(_email: string): string {
    return "Email já está em uso";
  }
}
