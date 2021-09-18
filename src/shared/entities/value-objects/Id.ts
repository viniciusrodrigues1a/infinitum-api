import crypto from "crypto";

export class Id {
  value: string;

  constructor() {
    this.value = crypto.randomUUID();
  }
}
