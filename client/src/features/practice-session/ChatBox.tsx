import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  BoxProps,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useRef, useEffect } from "react";

import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket } from "common/hooks/use-socket.hook";

import { selectUser } from "features/auth/user.slice";

interface ChatBoxProps extends BoxProps {}

export default function ChatBox({ sx, ...rest }: ChatBoxProps) {
  const [typedMessage, setTypedMessage] = React.useState("");
  const [messages, setMessages] = React.useState<
    {
      username: string;
      message: string;
    }[]
  >([]);

  const user = useAppSelector(selectUser);
  const userDisplayName = user ? user.displayName : "";
  const Messages = messages.map((message, i) => {
    return (
      <Box key={`${message.message + message.username}-${i}`}>
        <Box>
          <Typography
            variant="body1"
            fontSize="15"
            fontWeight="500"
            sx={{
              color: `${
                message.username === userDisplayName
                  ? "purple.main"
                  : "yellow.main"
              }`,
            }}
          >
            {message.username}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body1"
            fontSize="15"
            sx={{ color: `black.main` }}
          >
            {message.message}
          </Typography>
        </Box>
      </Box>
    );
  });

  const { socket } = useSocket();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const preventScroll = React.useRef(false);
  const scrollToBottom = () => {
    if (!preventScroll.current) {
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }

    preventScroll.current = false;
  };
  const sendMessage = (e: any) => {
    e.preventDefault();

    // prevent sending of empty texts
    if (typedMessage.trim().length === 0) {
      setTypedMessage("");
      return;
    }

    if (socket && user) {
      const payload = {
        username: user.displayName,
        message: typedMessage,
      };

      socket.emit("chat:message", payload);
      setTypedMessage("");
      setMessages((messages) => [payload, ...messages]);
    } else {
      console.error("Not connected to any socket");
    }
  };

  const hasSocketListener = useRef(false);
  useEffect(() => {
    if (socket && !hasSocketListener.current) {
      socket.on("chat:message", (payload) => {
        // prevent scrolling to bottom on receive of message
        preventScroll.current = true;

        setMessages((messages) => [payload, ...messages]);
      });

      hasSocketListener.current = true;
    }
  }, [socket]);

  useEffect(() => {
    // scroll to bottom when user sent a message
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "blue.main",
        padding: 2,
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <Stack
        spacing={2}
        sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          Chat
        </Typography>
        <Box>
          <Typography
            variant="body1"
            fontSize="15"
            fontWeight="100"
            align="center"
          >
            Messages sent will not be saved.
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column-reverse"
          sx={{ overflow: "hidden", overflowY: "scroll", flexGrow: 1 }}
        >
          {/* Order of bottom is reversed as we are using column-reverse */}
          <div ref={messagesEndRef} />
          {Messages}
        </Box>
        <Box component="form" onSubmit={sendMessage}>
          <TextField
            id="chat-textfield"
            variant="outlined"
            fullWidth
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Start typing here..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderLeft: 0,
                borderRight: 0,
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "blue.main",
                  borderRadius: 0,
                  borderLeft: 0,
                  borderRight: 0,
                },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
