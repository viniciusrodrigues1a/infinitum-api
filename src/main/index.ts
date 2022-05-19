/* eslint-disable no-console */
import { connection } from "@shared/infra/database/connection";
import { server } from "@main/server";
import { mongoHelper } from "@shared/infra/mongodb/connection";
import Queue from "@shared/infra/queue/Queue";

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

function exitWithError(error: Error) {
  console.log(`App exited with error: ${error} `);
  process.exit(ExitStatus.Failure);
}

function handleSignal(sig: string, closeOpenHandles: () => Promise<void>) {
  const forcedTimeout = 10 * 1000; // 10 secs

  return process.on(sig, async () => {
    try {
      console.log("Gracefully shutting down...");

      setTimeout(() => {
        console.log(
          "Couldn't close open handles in time, forcefully shutting down..."
        );
        process.exit();
      }, forcedTimeout);

      await closeOpenHandles();
    } catch (err) {
      exitWithError(err);
    }
  });
}

async function start() {
  await mongoHelper.connect();
  setTimeout(() => {
    server.start();
  }, 1000);
}

try {
  start();

  const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  exitSignals.map((sig) =>
    handleSignal(sig, async () => {
      server.close();
      await mongoHelper.destroy();
      await connection.destroy();
      await Queue.close();
    })
  );
} catch (err) {
  exitWithError(err);
}
