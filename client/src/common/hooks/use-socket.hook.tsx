import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export const Context = React.createContext<{
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>
  >;
}>({ socket: undefined, setSocket: () => {} });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = React.useState<Socket>();

  return (
    <Context.Provider value={{ socket, setSocket }}>
      {children}
    </Context.Provider>
  );
};

export function useSocket() {
  return React.useContext(Context);
}
