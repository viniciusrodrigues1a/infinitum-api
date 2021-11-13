import { ILanguage } from "./ILanguage";

export class PTBRLanguage implements ILanguage {
  getCannotUpdateRoleToOwnerErrorMessage(): string {
    return "Você não pode atualizar o cargo de um usuário para dono";
  }

  getCannotUpdateYourOwnRoleErrorMessage(): string {
    return "Você não pode atualizar seu próprio cargo";
  }

  getCannotUpdateRoleOfOwnerMessage(): string {
    return "Você não pode atualizar o cargo do dono do projeto";
  }

  getInvalidInvitationTokenErrorMessage(): string {
    return "Token de convite para projeto não é válido";
  }

  getOwnerCantBeUsedAsARoleForAnInvitationErrorMessage(): string {
    return "Você não pode convidar um usuário para a função de dono do projeto";
  }

  getAccountHasAlreadyBeenInvitedErrorMessage(_email: string): string {
    return "Este usuário já possui um convite pendente para este projeto";
  }

  getAccountAlreadyParticipatesInProjectErrorMessage(_email: string): string {
    return "Este usuário já participa deste projeto";
  }

  getIssueNotFoundErrorMessage(): string {
    return "Ticket não encontrado";
  }

  getIssueIdParamMessage(): string {
    return "id do ticket";
  }

  getRoleNameParamMessage(): string {
    return "nome do cargo";
  }

  getProjectNameParamMessage(): string {
    return "nome do projeto";
  }

  getExpiresAtParamMessage(): string {
    return "data de expiração";
  }

  getIssueGroupIdParamMessage(): string {
    return "id da seção de tickets";
  }

  getProjectIdParamMessage(): string {
    return "id do projeto";
  }

  getTitleParamMessage(): string {
    return "título";
  }

  getDescriptionParamMessage(): string {
    return "descrição";
  }

  getBeginsAtParamMessage(): string {
    return "data de início";
  }

  getFinishesAtParamMessage(): string {
    return "data de término";
  }

  getNameParamMessage(): string {
    return "nome";
  }

  getEmailParamMessage(): string {
    return "email";
  }

  getPasswordParamMessage(): string {
    return "senha";
  }

  getNoParamProvidedErrorMessage(): string {
    return "Nenhum parâmetro foi especificado";
  }

  getInvalidParamErrorMessage(param: string): string {
    return `Parâmetro inválido: ${param}`;
  }

  getProjectHasntBegunErrorMessage(): string {
    return "Este projeto ainda não começou";
  }

  getProjectIsArchivedErrorMessage(): string {
    return "Este projeto está arquivado";
  }

  getNotParticipantInProjectErrorMessage(
    participantIdentifier: string
  ): string {
    return `Usuário ${participantIdentifier} não faz parte deste projeto`;
  }

  getInvalidRoleNameErrorLanguage(_name: string): string {
    return "Função no projeto não é válida";
  }

  getRoleInsufficientPermissionErrorMessage(_roleIdentifier: string): string {
    return "Você não possui permissão";
  }

  getProjectNotFoundErrorMessage(): string {
    return "Projeto não encontrado";
  }

  getBeginsAtMustBeBeforeFinishesAtErrorMessage(): string {
    return "Data de término não pode ser antes da data de começo";
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
