import { UpdateAccountRepositoryDTO } from "../../DTOs";

export interface IUpdateAccountRepository {
  updateAccount(data: UpdateAccountRepositoryDTO): Promise<void>;
}
