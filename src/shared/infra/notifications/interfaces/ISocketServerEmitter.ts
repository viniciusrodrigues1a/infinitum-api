export interface ISocketServerEmitter {
  emitToUser(email: string, event: string, payload: any): void;
}
