import { CreateAccountDTO } from "../../DTOs";

export interface ICreateAccountRepository {
  create(data: CreateAccountDTO): Promise<void>;
}
