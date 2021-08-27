export class InvalidEmailError extends Error {
  constructor() {
    const message = `Email não é válido`;
    super(message);
    this.message = message;
  }
}
