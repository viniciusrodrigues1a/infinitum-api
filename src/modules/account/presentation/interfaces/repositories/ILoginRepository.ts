import { RegisterRepositoryDTO } from "../../DTOs";

export interface ILoginRepository {
  login(data: Omit<RegisterRepositoryDTO, "name">): Promise<string>;
}
