import React from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export const Context = React.createContext<{
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}>({ socket: undefined });

const socket = io();

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <Context.Provider value={{ socket }}>{children}</Context.Provider>;
};

export function useSocket() {
  return React.useContext(Context);
}
