import axios from "axios";
import { io } from "socket.io-client";

import { store } from "app/store";

import { DifficultyLevel } from "features/matching/matching.slice";

export async function joinSession(difficulty: DifficultyLevel) {
  const user = store.getState().user;

  if (user) {
    await axios.post(
      "/practice",
      { difficulty },
      { headers: { token: user.token } }
    );

    // connect to socket after adding user id to session
    const socket = io({
      extraHeaders: { token: user.token },
    });

    return socket;
  }
}
