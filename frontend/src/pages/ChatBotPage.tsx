import Typography from "@mui/material/Typography/Typography";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import getChatResponse from "../utils/api";
import Box from "@mui/material/Box/Box";
import Linkify from 'react-linkify';
import { createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

interface IChatData {
  sender?: string;
  message: string;
}
interface SuggestedTagProps {
  value: string;
  handleClick: (value: string) => void;
  sx?: any;
}
const initialTag=["I want to find a course","Give me some information about specific skill","What can you do?"]

const scrollToBottom = () => {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};
const mockData: IChatData[] = [
  { sender: "bot", message: "Hello, How can I assist you?" },
];

const SuggestedTag: React.FC<SuggestedTagProps> = ({
  value,
  handleClick,
  sx,
}) => {
  return (
    <Box sx={sx}>
      <Button
        variant="outlined"
        sx={{
          height: 25,
          //   border: 0,
          //   outline: 0,
          textAlign: "center",
          width: "100%",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          },
          bgcolor: "#f2f2f2",
        }}
        onClick={() => {
           handleClick(value);
        }}
      >
        <Typography
          variant="body1"
          sx={{
            borderRadius: "10px",
            overflow: "hidden",
            p: 1,
            textTransform:"capitalize",
            fontSize: "0.8rem",
            // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            // "&:hover": {
            //   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
            // },
          }}
        >
          {value}
        </Typography>
      </Button>
    </Box>
  );
};

const HistoryPanel: React.FC = () => {
  return <Box></Box>;
  return (
    <Box
      sx={{
        width: "20%",
        height: "100%",
        borderRadius: 2,
        backgroundColor: "#FFFFF0FF",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: "#000000",
          textAlign: "center",
        }}
      >
        History goes here
      </Typography>
    </Box>
  );
};
const BotText: React.FC<IChatData> = (props: IChatData) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-starts",
        alignItems: "center",
        width: "65%",
        whiteSpace:"pre-line"
      }}
    >
      <Avatar src="data:image/png;base64,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" />
      <Typography
        variant="body1"
        sx={{
          bgcolor: "#4E5652",
                color: "#FFFFFF",
                borderTopLeftRadius:"10px",
                borderTopRightRadius:"10px",
                borderBottomRightRadius:"10px",
                overflow: "hidden",
                m: 1,
                padding:1,
                boxShadow: 3,
                fontSize:15,
        }}
      >
        <Typewriter text={props.message} delay={9} />
      </Typography>
    </Box>
  );
};

const UserText: React.FC<IChatData> = (props: IChatData) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        whiteSpace:"pre-line"
      }}
    >
            <Typography
              variant="body1"
              sx={{
                bgcolor: "#25A18E",
                color: "#FFFFFF",
                borderTopLeftRadius:"10px",
                borderTopRightRadius:"10px",
                borderBottomLeftRadius:"10px",
                overflow: "hidden",
                m: 1,
                padding:1,
                boxShadow: 3,
                fontSize:15,
              }}
            >
              {props.message}
            </Typography>
      <Avatar />
    </Box>
  );
};

const ChatBotPage: React.FC = () => {
  const chatHistory: IChatData[] = mockData;
  const [chatData, setChatData] = React.useState<IChatData[]>(chatHistory);
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [suggestion,setSuggestion]=React.useState<string[]>(initialTag);
  const [trackServer,setTrackServer]=React.useState([])


  // useEffect(() => {
    
  //   // Initialize WebSocket connection
  //   if (!wsRef.current) {
  //       const ws = new WebSocket("ws://localhost:8000/ws");
  //       wsRef.current = ws;
    
  //       ws.onopen = () => {
  //         console.log("WebSocket connection established");
  //       };
  //   }

  
    // ws.onmessage = (e) => {
    //   const messages = document.getElementById('messages') as HTMLUListElement;;
    //   if (messages) {
    //     const messageElement = document.createElement('li');
    //     const content = document.createTextNode(e.data);
    //     const message = JSON.parse(e.data);
    //     setChatData([...chatData, { sender: "bot",  message: message}]);
    //     messageElement.appendChild(content);
    //     messages.appendChild(messageElement);
    //   }
    // };
  
    // Clean up WebSocket connection on component unmount
    // return () => {
    //   if (wsRef.current) {
    //     wsRef.current.close();
    //   }
    // };
  // }, []);
  
  // const sendMessage = (value?: string) => {
  //   console.log('handleChat called with value:', value);
  //   if ((message.trim()||value?.trim()) && wsRef.current) {
  //     wsRef.current.send(value??message);
  //     chatHistory.push({ sender: "user", message: value ?? message });
  //       setChatData([...chatHistory]);
  //       setIsLoading(true);
  //       scrollToBottom();
  //       if (!Boolean(value)) setMessage("");
  //     wsRef.current.onmessage = (e) => {
  //       // const message = JSON.parse(e.data);
  //       const data = JSON.parse(e.data)
  //       console.log(data.respone.tag)
  //       chatHistory.push( {sender: "bot",  message: data.respone.answer});
  //       setSuggestion(data.tag);
  //       setChatData([...chatHistory]);
  //        setIsLoading(false);
  //           scrollToBottom();
  //     };
  //   }
  // };

  // React.useEffect(() => {
  //   document.documentElement.classList.toggle("fake-dark-mode");
  // }, []);

  const handleChat = (value?: string) => {
    // setMessage(value);
    chatHistory.push({ sender: "user", message: value ?? message });
    setChatData([...chatHistory]);
    setIsLoading(true);
    scrollToBottom();
    if (!Boolean(value)) setMessage("");

    getChatResponse(value??message,trackServer)
      .then((res) => {
        console.log(res);
        chatHistory.push({
          sender: "bot",
          message: res.response.answer,
        });
        setChatData([...chatHistory]);
        setTrackServer(res.response.history)
        setSuggestion(res.response.tag)
        setIsLoading(false);
        scrollToBottom();
      })
      .catch((err) => {
        chatHistory.push({
          sender: "bot",
          message: err.message ?? "There is somethings wrong!!",
        });
        setChatData([...chatHistory]);
        setIsLoading(false);
        scrollToBottom();
      });
  };

  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(343px at 46.3% 47.5%, rgb(242, 242, 242) 0%, rgb(241, 241, 241) 72.9%)",
        
        // pt: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: 600,
          height: "100%",
          maxHeight: 1000,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HistoryPanel />
        <Box
          sx={{
            width: "60%",
            height: "100%",
            background: 'linear-gradient(to right bottom, #F8F8FF, #eeeef0)',
            boxShadow: 3,
            borderRadius: 2,
            overflow: "auto",
            bgcolor:"EEEEEE",
            scrollbarWidth:"thin",
            WebkitOverflowScrolling:{
              display:"none"
            },
          }}
        >
          <Box
          >
            <Typography sx={{display: 'flex', 
        justifyContent: 'center', 
          alignItems: 'center',
        textAlign: 'center',
        background:"linear-gradient(315deg, #378b29 0%, #18a428 74%)",
          fontSize:"20px",
        borderRadius:"4px",
        fontWeight:'bold',
        color:'#e3e0e0',
          boxShadow:3}}>
          LearnWayBot
    </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "0%",
              display: "flex",
            }}
          >
          </Box>
          <Box
            sx={{
              width: "100%",
              //   height: "100%",
              height: "76vh",
              maxHeight: 692,
              padding: 1,
              overflow: "scroll",
              scrollbarWidth:"none",
              WebkitOverflowScrolling:{
                display:"none"
              }
            }}
            id="chat-box"
          >
            {chatData.map((data: IChatData, idx: number) => {
              return data.sender === "bot" ? (
                <BotText key={`chat-${idx}`} message={data.message} />
              ) : (
                <UserText key={`chat-${idx}`} message={data.message} />
              );
            })}

            {isLoading && <BotText message={"Loading...."}  />}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              p: 0.5,
              alignItems: "center",
              justifyContent: "center",
              height:20,
             marginBlockEnd:7
            }}
          >
           
            {
                suggestion.length!==0  && !isLoading &&
                suggestion.map((tag: string)=>{
                  if(tag.length!==0)
                    return <SuggestedTag  value={tag} handleClick={handleChat}
                    sx="5">
                    </SuggestedTag>
                })
            }
        
          </Box>
          <Box
            sx={{
              height: 80,
              width: "100%",
              display:"flex",
              flexWrap:"nowrap",
              justifyContent:"space-around",
              alignItems:"center",
            }}
          >
            <Button
              onClick={() => {
                chatHistory.splice(0, chatHistory.length);
                chatHistory.push({
                  sender: "bot",
                  message: "Hello, How can I help you?",
                });
                setChatData([]);
                setTimeout(() => {
                  setChatData(() => {
                    return [
                      { sender: "bot", message: "Hello, How can I help you?" },
                    ];
                  });
                }, 500);
              }}
              disabled={isLoading}
            >
              <DeleteIcon />
            </Button>
            <OutlinedInput
              sx={{
                borderBlockStart:"1px",
                outline: 0,
                width: "88%",
                px: 1,
                textAlign: "center",
                borderRadius:"10px",
                boxShadow:"3",
                background: "#fff",
                "::placeholder":'bold',
              }}
              onKeyDown={(e) => {
                if (message !== "" && e.key === "Enter") {
                  handleChat();
                }
              }}
              placeholder="Type a new message here"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            >
            </OutlinedInput>
            <Button
            onClick={() => {
              // handleChat();
              handleChat()
            }}
          >
            <SendIcon/>
          </Button>
          </Box>
        </Box>
      </Box>
    </Box>
    </ThemeProvider>
  );
};

interface TypewriterProps {
  text: string;
  delay: number;
}


const Typewriter: React.FC<TypewriterProps> = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, text, delay]);

  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a key={key} href={decoratedHref} style={{ color:"#92b9e3"  }}>{decoratedText}</a>
      )}
    >
      {currentText}
    </Linkify>
  );

}
export default ChatBotPage;
