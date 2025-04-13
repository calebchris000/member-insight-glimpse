import { Server as HttpServer } from "http";

import { Server as SocketIOServer, Socket } from "socket.io";

export class SocketServer {
  /** @type {SocketIOServer} */
  socket = null;
  /** @type {Socket} */
  client = null;

  /**
   * @param {HttpServer} server
   */
  constructor(server) {
    this.socket = new SocketIOServer(server, {
      cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });
  }

  setupSocket() {
    this.socket.on("connect", (client) => {
      this.client = client;
      console.log("Socket service started");
    });
  }

  onActivity(data) {
    if (this.client) {
      console.log("Client");
      this.socket.emit("activity", data);
    }
  }

  onMetric(data) {
    if (this.client) {
      this.socket.emit("metric", data);
    }
  }

  sendMetric(data) {
    this.onMetric(data);
  }

  sendActivity(data) {
    console.log("Sending activity");
    this.onActivity(data);
  }
}
