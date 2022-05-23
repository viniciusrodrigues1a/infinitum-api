import { RegisterRepositoryDTO } from "../../DTOs";

export type LoginRepositoryTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface ILoginRepository {
  login(
    data: Omit<RegisterRepositoryDTO, "name" | "languageIsoCode">
  ): Promise<LoginRepositoryTokens>;
}
