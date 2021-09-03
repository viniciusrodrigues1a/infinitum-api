import crypto from "crypto";

export type Pbkdf2Hash = {
  hash: string;
  salt: string;
  iterations: number;
};

class Pbkdf2 {
  hash(plaintext: string): Pbkdf2Hash {
    const salt = crypto.randomBytes(128).toString("base64");
    const iterations = 20000;
    const hash = crypto
      .pbkdf2Sync(plaintext, salt, iterations, 64, "sha512")
      .toString("hex");

    return { hash, salt, iterations };
  }

  compare(plaintext: string, savedHash: Pbkdf2Hash): boolean {
    const newHash = crypto
      .pbkdf2Sync(plaintext, savedHash.salt, savedHash.iterations, 64, "sha512")
      .toString("hex");

    return savedHash.hash === newHash;
  }
}

export const pbkdf2 = new Pbkdf2();
