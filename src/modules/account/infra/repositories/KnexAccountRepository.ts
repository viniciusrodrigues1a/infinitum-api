import { Account } from "@modules/account/entities/Account";
import {
  UpdateAccountImageRepositoryDTO,
  UpdateAccountRepositoryDTO,
} from "@modules/account/presentation/DTOs";
import {
  IFindAccountImageDataURLRepository,
  IFindAccountLanguageIdRepository,
  IListLanguagesRepository,
  IUpdateAccountImageRepository,
  IUpdateAccountRepository,
  Language,
} from "@modules/account/presentation/interfaces/repositories";
import {
  IDoesAccountExistRepository,
  IFindOneAccountRepository,
} from "@modules/account/use-cases/interfaces/repositories";
import { connection } from "@shared/infra/database/connection";
import { IFindOneAccountIdByEmailRepository } from "@shared/infra/notifications/interfaces";
import { getDataURLFromImageBuffer } from "@shared/infra/repositories/helpers";
import { pbkdf2 } from "../cryptography";

export class KnexAccountRepository
  implements
    IDoesAccountExistRepository,
    IFindOneAccountRepository,
    IUpdateAccountRepository,
    IUpdateAccountImageRepository,
    IListLanguagesRepository,
    IFindAccountImageDataURLRepository,
    IFindAccountLanguageIdRepository,
    IFindOneAccountIdByEmailRepository
{
  async findOneAccountIdByEmail(email: string): Promise<string | undefined> {
    const account = await connection("account")
      .select("id")
      .where({ email })
      .first();

    if (!account) return undefined;

    return account.id;
  }

  async findAccountLanguage(email: string): Promise<string | null> {
    const { language_id: languageId } = await connection("account")
      .select("language_id")
      .where({ email })
      .first();

    return languageId;
  }

  async findAccountImageDataURL(email: string): Promise<string | undefined> {
    const { image: buffer } = await connection("account")
      .where({ email })
      .select("image")
      .first();

    if (!buffer) return undefined;

    return getDataURLFromImageBuffer(buffer);
  }

  async listLanguages(): Promise<Language[]> {
    const languages = await connection("language").select("*");

    return languages.map((l) => ({
      id: l.id,
      isoCode: l.iso_code,
      displayName: l.display_name,
    }));
  }

  async updateAccountImage({
    email,
    fileBuffer,
  }: UpdateAccountImageRepositoryDTO): Promise<void> {
    await connection("account").update({ image: fileBuffer }).where({ email });
  }

  async updateAccount({
    email,
    newName,
    newEmail,
    newPassword,
    newLanguageId,
  }: UpdateAccountRepositoryDTO): Promise<void> {
    const { id } = await connection("account")
      .select("*")
      .where({ email })
      .first();

    let updatedFields: any = {
      name: newName,
      email: newEmail,
      language_id: newLanguageId,
    };

    if (newPassword) {
      const { hash, salt, iterations } = pbkdf2.hash(newPassword);
      updatedFields = {
        ...updatedFields,
        password_hash: hash,
        salt,
        iterations,
      };
    }

    try {
      await connection("account").where({ id }).update(updatedFields);
    } catch (err) {
      if (err.message.includes("Empty .update() call detected!")) return;

      throw err;
    }
  }

  async findOneAccount(email: string): Promise<Account | undefined> {
    const account = await connection("account")
      .select("*")
      .where({ email })
      .first();

    return account;
  }
  async doesAccountExist(email: string): Promise<boolean> {
    const account = await connection("account")
      .select("email")
      .where({ email })
      .first();

    return !!account;
  }
}
