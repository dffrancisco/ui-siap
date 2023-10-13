import config from "./config";
import socketListen from "./socketListen";
import { io, Socket } from "socket.io-client";
import { actions } from '../pages/login/login'

class ClientSocket {
  //@ts-ignore
  socket: Socket;
  URL_SERVER: string;

  constructor() {
    this.URL_SERVER = config.SERVER + ':' + config.PORT
  }

  public connect(query: any) {
    this.socket = io(this.URL_SERVER, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
      forceNew: true,
      rejectUnauthorized: false,
      secure: true,
      query: { ...query },
    });

    this.socket.connect();

    config.socket = this.socket

    new socketListen(this.socket);

    this.onConnect();
    this.onDisconnect();
  }

  private onConnect() {
    this.socket.on("connect", () => {
  
      console.log("connect", this.socket.id);
    });
  }

  private onDisconnect() {
    this.socket.on("disconnect", (reason) => {
    
      console.log("disconnect", reason);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default new ClientSocket();
