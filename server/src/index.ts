import * as http from "http";

import App from "./app";

const port = process.env.NODE_DOCKER_PORT || 8080;
App.set("port", port);

const server = http.createServer(App);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  console.error(`Error code: ${error.code}`);
  process.exit(1);
}

function onListening(): void {
  let addr = server.address();
  console.log(`Listening on ${addr.address}:${addr.port}`);
}
