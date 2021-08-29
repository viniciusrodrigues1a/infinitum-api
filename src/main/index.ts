/* eslint-disable no-console */
import { connection } from "@shared/infra/database/connection";
import { ExpressServer } from "./server";

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

function exitWithError(error: Error) {
  console.log(`App exited with error: ${error} `);
  process.exit(ExitStatus.Failure);
}

function handleSignal(sig: string, closeOpenHandles: () => void) {
  return process.on(sig, async () => {
    try {
      console.log("Gracefully shutting down...");
      closeOpenHandles();
      await connection.destroy();
    } catch (err) {
      exitWithError(err);
    }
  });
}

try {
  const server = new ExpressServer();
  server.start();

  const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  exitSignals.map((sig) => handleSignal(sig, () => server.close()));
} catch (err) {
  exitWithError(err);
}
