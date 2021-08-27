export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    const message = `Email ${email} já está em uso`;
    super(message);
    this.message = message;
  }
}
