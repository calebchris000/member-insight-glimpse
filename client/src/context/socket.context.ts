import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface GlobalContext {
  socket: Socket;
  setSocket: unknown;
}

export const GlobalContext = createContext<GlobalContext>({
  socket: {} as Socket,
  setSocket: () => {},
});

export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }

  return context;
};
