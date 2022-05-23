import { LoginRepositoryTokens } from "./ILoginRepository";

export interface IRefreshTokenRepository {
  refreshToken(token: string): Promise<LoginRepositoryTokens>;
}
