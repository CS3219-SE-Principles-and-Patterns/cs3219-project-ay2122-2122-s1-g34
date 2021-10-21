import { Box, BoxProps, Stack, Typography, TextField, useTheme, TextFieldProps} from "@mui/material";
import { useAppSelector } from "common/hooks/use-redux.hook";
import { selectUser } from "features/auth/user.slice";
import SendIcon from '@mui/icons-material/Send';
import React, {useRef, useEffect} from "react";
import { useSocket } from "common/hooks/use-socket.hook";


interface ChatBoxProps extends BoxProps {
}

export default function ChatBox({ sx, ...rest }: ChatBoxProps) {
  const { socket } = useSocket();

  const themePalette = useTheme().palette;

  const user = useAppSelector(selectUser);
  const userDisplayName = user ? user.displayName : "";

  const [typedMessage, setTypedMessage] = React.useState("");

  //dummy
  const [messages, setMessages] = React.useState([{"username":"firstuser","message":"testmessage"}]);
  // ([{"username":"John Tan","message":"hi, how do you think we should start?"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem"},
  // {"username":"John Tan","message":"yeskbalbgafa"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem kabfbjksbvksncfkalbfelkgvasgvsga"},
  // {"username":"John Tan","message":"i think we should start with breaking down the problemsgvsa sbegeagsdb"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problemsefaefjkafbkjfbskflabfaklf"},
  // {"username":"John Tan","message":"hi, how do you think we should start?"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem"},
  // {"username":"John Tan","message":"yeskbalbgafa"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem kabfbjksbvksncfkalbfelkgvasgvsga"},
  // {"username":"John Tan","message":"i think we should start with breaking down the problemsgvsa sbegeagsdb"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problemsefaefjkafbkjfbskflabfaklf"},
  // {"username":"John Tan","message":"hi, how do you think we should start?"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem"},
  // {"username":"John Tan","message":"yeskbalbgafa"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem kabfbjksbvksncfkalbfelkgvasgvsga"},
  // {"username":"John Tan","message":"i think we should start with breaking down the problemsgvsa sbegeagsdb"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problemsefaefjkafbkjfbskflabfaklf"},
  // {"username":"John Tan","message":"hi, how do you think we should start?"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem"},
  // {"username":"John Tan","message":"yeskbalbgafa"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problem kabfbjksbvksncfkalbfelkgvasgvsga"},
  // {"username":"John Tan","message":"i think we should start with breaking down the problemsgvsa sbegeagsdb"},
  // {"username":"Alice Lee","message":"i think we should start with breaking down the problemsefaefjkafbkjfbskflabfaklf"}]);

  const postMessage = () => {
    //messages.push({"username":userDisplayName,"message":typedMessage});
    //setMessages(messages);
    socket?.emit("chat:send_message",{"username":userDisplayName,"message":typedMessage});
		setTypedMessage("");
    scrollToBottom();
	}

  const Messages = Array.from(messages).map((onemessage) => {
    if (onemessage.username===userDisplayName){ //user's message
      return (
        <><Box>
          <Typography variant="body1" fontSize="15" fontWeight="500" sx={{ color: `${themePalette.purple.main}` }}>
            {onemessage.username}
          </Typography>
        </Box><Box sx={{mb:2}}>
            <Typography variant="body1" fontSize="15" sx={{ color: `${themePalette.black.main}` }}>
              {onemessage.message}
            </Typography>
          </Box></> 
      )
    }
    else{ //peer's message
      return (
        <><Box>
          <Typography variant="body1" fontSize="15" fontWeight="500" sx={{ color: `${themePalette.yellow.main}` }}>
            {onemessage.username}
          </Typography>
        </Box><Box sx={{mb:2}}>
            <Typography variant="body1" fontSize="15" sx={{ color: `${themePalette.black.main}` }}>
              {onemessage.message}
            </Typography>
          </Box></>
      )
    }
  })

  //const messagesEndRef = useRef(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [{Messages}]);

  socket?.on("chat:receive_message",(payload)=>{
    messages.push(payload.message);
    setMessages(messages);
  }); 

  return (
    <Box
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#67A0AC",
        padding: 2,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{marginBottom: 3 }}>
              Chat
        </Typography>
        <Box>
          <Typography variant="body1" fontSize="15" fontWeight="100" align="center">
              Messages sent will not be saved.
          </Typography>
        </Box>
        <Box display="flex"
            flexDirection="column"
            height="400px"
            sx={{overflow:"hidden", overflowY: "scroll"}}>
          {Messages}
          <div ref={messagesEndRef} />
        </Box>
        <Box>
          <TextField id="chat-textfield"
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyPress={(e)=>{if (e.key === 'Enter'&& typedMessage!=="") {postMessage()}}}
                    placeholder="Start typing here..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline":
                      {
                        borderLeft:0,
                        borderRight:0
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#67A0AC",
                          borderRadius: 0,
                          borderLeft: 0,
                          borderRight: 0
                        },
                    }}
                    //disabled={} - for when disconnected
          />
        </Box> 
    </Stack>
    </Box>
  );
}
