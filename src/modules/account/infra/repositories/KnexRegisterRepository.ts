import crypto from "crypto";
import { connection } from "@shared/infra/database/connection";
import { Account } from "@modules/account/entities/Account";
import { IInvalidEmailErrorLanguage } from "@modules/account/entities/interfaces/languages";
import { EmailAlreadyInUseError } from "@modules/account/use-cases/errors";
import { IEmailAlreadyInUseErrorLanguage } from "@modules/account/use-cases/interfaces/languages";
import { IRegisterRepository } from "@modules/account/presentation/interfaces/repositories";
import { RegisterRepositoryDTO } from "@modules/account/presentation/DTOs";
import { IDoesAccountExistRepository } from "@modules/account/use-cases/interfaces/repositories";
import { NotificationSettings } from "@shared/infra/mongodb/models";
import { ICreateNotificationSettingsRepository } from "@shared/infra/notifications/interfaces";
import { pbkdf2 } from "../cryptography";

export class KnexRegisterRepository implements IRegisterRepository {
  constructor(
    private readonly doesAccountExistRepository: IDoesAccountExistRepository,
    private readonly createNotificationSettingsRepository: ICreateNotificationSettingsRepository,
    private readonly invalidEmailErrorLanguage: IInvalidEmailErrorLanguage,
    private readonly emailAlreadyInUseErrorLanguage: IEmailAlreadyInUseErrorLanguage
  ) {}

  async create({
    name,
    email,
    password,
    languageIsoCode,
  }: RegisterRepositoryDTO): Promise<void> {
    const account = new Account(name, email, this.invalidEmailErrorLanguage);

    const accountAlreadyExists =
      await this.doesAccountExistRepository.doesAccountExist(account.email);
    if (accountAlreadyExists) {
      throw new EmailAlreadyInUseError(
        email,
        this.emailAlreadyInUseErrorLanguage
      );
    }

    const uuid = crypto.randomUUID();

    const { hash, salt, iterations } = pbkdf2.hash(password);

    let languageId;

    if (languageIsoCode) {
      const language = await connection("language")
        .select("id")
        .where({ iso_code: languageIsoCode })
        .first();

      if (language) {
        languageId = language.id;
      }
    }

    await connection("account").insert({
      id: uuid,
      name,
      email,
      password_hash: hash,
      salt,
      iterations,
      language_id: languageId,
    });

    const notificationSettings: NotificationSettings = {
      user_id: uuid,
      invitation: { push: true, email: true },
      kicked: { push: true, email: true },
      roleUpdated: { push: true, email: false },
      issueAssigned: { push: true, email: false },
      projectDeleted: { push: true, email: true },
      roleUpdatedAdmin: { push: true, email: true },
      kickedAdmin: { push: true, email: true },
    };
    await this.createNotificationSettingsRepository.createNotificationSettings(
      notificationSettings
    );
  }
}
