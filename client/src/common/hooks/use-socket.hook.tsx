import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const Context = React.createContext<{
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

export function useOnSocketDisconnect(onDisconnect: () => void) {
  const { socket } = useSocket();

  React.useEffect(() => {
    if (socket) {
      socket.on("disconnect", onDisconnect);

      return () => {
        socket.off("disconnect", onDisconnect);
      };
    }
  }, [socket, onDisconnect]);
}

export function useOnSocketConnect(onConnect: (client: Socket) => void) {
  const hasRun = React.useRef(false);
  const { socket } = useSocket();

  React.useEffect(() => {
    if (socket && !hasRun.current) {
      const connectedCallback = () => {
        hasRun.current = true;
        onConnect(socket);
      };

      if (socket.connected) {
        connectedCallback();
      } else {
        // socket not connected yet, we wait for connection to run callback
        socket.on("connect", connectedCallback);

        return () => {
          socket.off("connect", connectedCallback);
        };
      }
    }
  }, [socket, onConnect]);
}
