import { UpdateAccountImageRepositoryDTO } from "../../DTOs/UpdateAccountImageRepositoryDTO";

export interface IUpdateAccountImageRepository {
  updateAccountImage(data: UpdateAccountImageRepositoryDTO): Promise<void>;
}
