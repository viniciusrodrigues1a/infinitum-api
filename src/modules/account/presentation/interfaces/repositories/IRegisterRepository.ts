import { RegisterRepositoryDTO } from "../../DTOs";

export interface IRegisterRepository {
  create(data: RegisterRepositoryDTO): Promise<void>;
}
