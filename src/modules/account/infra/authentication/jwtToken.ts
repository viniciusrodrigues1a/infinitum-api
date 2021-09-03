import jwt, { Secret, JwtPayload, SignOptions } from "jsonwebtoken";

type JwtConfig = {
  privateKey: Secret;
  publicKey: Secret;
  signOptions: SignOptions;
};

class JwtToken {
  _config: JwtConfig = {
    privateKey: process.env.JWT_PRIVATE_KEY as Secret,
    publicKey: process.env.JWT_PUBLIC_KEY as Secret,
    signOptions: {
      algorithm: "RS256",
      expiresIn: "6h",
    },
  };

  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this._config.privateKey);
  }

  verify(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, this._config.publicKey, (error, data) =>
        error ? reject(error) : resolve(data || {})
      )
    );
  }
}

export const jwtToken = new JwtToken();
