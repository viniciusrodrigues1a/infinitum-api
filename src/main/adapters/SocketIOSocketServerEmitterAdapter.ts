import { Server } from "@main/server";
import { ISocketServerEmitter } from "@shared/infra/notifications/interfaces";

export function SocketIOSocketServerEmitterAdapter(
  socketServer: Server
): ISocketServerEmitter {
  function emitToUser(email: string, event: string, payload: any): void {
    const user = socketServer.getUser(email);

    if (!user) return;

    socketServer.socketServer.to(user.socketId).emit(event, payload);
  }

  return {
    emitToUser,
  };
}
