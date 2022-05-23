import crypto from "crypto";
import {
  IRefreshTokenRepository,
  LoginRepositoryTokens,
} from "@modules/account/presentation/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import moment from "moment";
import { jwtToken } from "../authentication";

export class KnexRefreshTokenRepository implements IRefreshTokenRepository {
  async refreshToken(token: string): Promise<LoginRepositoryTokens> {
    const rt = await connection("refresh_token")
      .select("*")
      .where({ token })
      .first();

    if (!rt) {
      throw new Error("Refresh token is invalid");
    }

    const hasExpired = moment(rt.expires_at).isBefore(moment().utc());

    if (hasExpired) {
      throw new Error("Refresh token is invalid");
    }

    const newRT = crypto.randomUUID();
    await connection("refresh_token")
      .update({
        token: newRT,
      })
      .where({ id: rt.id });

    const { email } = await connection("account")
      .select("email")
      .where({ id: rt.account_id })
      .first();
    const accessToken = jwtToken.sign({ email });

    return {
      accessToken,
      refreshToken: newRT,
    };
  }
}
