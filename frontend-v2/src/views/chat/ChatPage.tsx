import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React, { useCallback, useEffect, useState } from "react";
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import getChatResponse, { deleteChat } from "../../services/chat/chat";
import {getChatHistory} from "../../services/chat/chat";
import Linkify from "react-linkify";
import { createTheme, Divider, Drawer, IconButton, ThemeProvider } from "@mui/material";
import ChatCard from "./components/ChatCard";
import { ConstructionOutlined, OpenInNew } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { List } from "echarts";
import DrawerNavigation from "./components/Drawer";
import { Console } from "console";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

interface IChatData {
  sender?: string;
  message: string;
}
interface ChatTag{
  props:IChatData;
  isChat:boolean;
}
interface SuggestedTagProps {
  value: string;
  handleClick: (value: string) => void;
  sx?: any;
}
const initialTag = [
  "I want to find a course",
  "Give me some information about specific skill",
  "What can you do?",
];

const scrollToBottom = () => {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};
const mockData: IChatData[] = [
  { sender: "bot", message: "Hello, How can I assist you?" },
];
const loadingMessage:IChatData = 
  { sender: "bot", message: "Loading..." }
;

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
            textTransform: "capitalize",
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

const HistoryPanel: React.FC = ({isOpen,setIsOpen,handleHistory,handleNewChat,handleDelete,historyLength}) => {
  const [historyList,setHistoryList]=useState<List[]>();
  const [selectedIndex,setSelectedIndex]=React.useState<number | null>(null);
  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatHistory = await getChatHistory();
      setHistoryList(chatHistory);
      // console.log(chatHistory[0]);
    };

    fetchChatHistory();
    setSelectedIndex(null);
  }, [historyLength]);

  const handleItemClick=(index:number)=>{
    setSelectedIndex(index);
  }
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        // borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // backgroundColor: "whitesmoke",
        visibility: !isOpen? "hidden":"visible",
        width: !isOpen? "0%": "20%",
        height: 700,
        
        // marginTop: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
                }}
      >
         <Box sx={{ 
        height:"6%",
        width:"100%",
        borderTop: .5,
        borderBottom:.5,
        borderLeft:.5,
        color: "#E9EAEC",
        // background: "#28a820",
        background: "#f7f7f7",
       }}>
      {isOpen&& <IconButton onClick={handleToggle}>
        <ViewSidebarIcon />
      </IconButton>}
      </Box>
      <Box
            sx={
              {
                height: "88%",
                width : "100%", 
                overflowY : "scroll",
                scrollbarWidth: "thin",
              }
            }
            >
        {isOpen && historyList?.slice().reverse().map((history, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height:56,
                bgcolor: selectedIndex === idx ? "#d5edd3" : "#FFFFFF",
                borderBottom: 1,
                color: "#f1f2f2",
                ":hover":{
                  backgroundColor: selectedIndex === idx ?"#d5edd3":"#f7f7f7",
                boxShadow: selectedIndex === idx ? 3:1,
                color:selectedIndex === idx  ? "white":"black",
                }
                // boxShadow: 3,
                
                // flexGrow:1,
              }}
              onClick={()=>{handleItemClick(idx)}}
            >
              <ChatCard history={history} showHistory={handleHistory} handleDelete={handleDelete}></ChatCard>
              <Divider
                sx={{
                  borderBottomWidth: 1,
                }}
              ></Divider>
            </Box>
          );
        })} </Box>
      </Box>
      <Box sx={{
        height: "8%",
        width: "100%",}}>
        <Button
          sx={{
            backgroundColor: "#222222", 
            color: "white",
            width: "100%",
            height: "100%",
            ":hover": {
              backgroundColor: "#222222",
            },
          }}
          onClick={handleNewChat}
        >
          <OpenInNew sx={{}}></OpenInNew>
          New Chat
        </Button>
      </Box>
    </Box>
  );
};

const BotText: React.FC<ChatTag> = ({props,isChat}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-starts",
        alignItems: "center",
        width: "65%",
        whiteSpace: "pre-line",
      }}
    >
      <Avatar src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAACUCAMAAAC6AgsRAAAAaVBMVEX///8AAAD+/v7k5OTFxcWjo6PJycnc3NwwMDDn5+cEBAQKCgqUlJT7+/vf39/t7e3Q0NA4ODirq6v09PSEhIRJSUm3t7cXFxd0dHQSEhJcXFw9PT0pKSmamppjY2ONjY1RUVFra2sgICDBJTWpAAAGDklEQVR4nO2biZKiMBCGQ7jkCDcIiILz/g+56Q6MouBFHKja/LVrqYPho+kk3Z1AiJKSkpKSkpKSkpKSktJ/K7o2wKQo7cEoW5lkWpwvdRwnpBu1H0mTU6NVeWutDTIhbjwj1oT2GducCRktOJmL/zTtlK7Ncyd7L9CEsrVx7tQB3s+pLXMEjNbmuZENd7YCqrQE0mxjDmiC0QrwQxJ2/G3nrE00Ess4Ux7ybswHZx/6sL020kis5Ex1iOMM2tLblgNSsF8cgNMx/t7Vmm3ZjyTgfy2+tXe9LTcjbja9AsBjmqb2AfqvvzbTWJRkODzvTzlOI/stmQ/lHLR+coOXZG2cW1HidAJtk3ggPesn34OxNsqk+MxxAjxrm+EzDM0t8KWbC/6E2C/fOgZkXE8OQb4nB/EZ+jv2xWb1yJpXBLOwZjw6QidfzO9sX1su/yszM7cdOzavnN99dkBzTDHMkcwXnl85+Uv451B6F6esk4In2ujke+BRc6HlsjCWqCgF5FEmGtwLC9PHcvltgUibxzcWkVlGohgfayUfeukyMcjvuFqJPYS3lMJFH0LEW3SdHDCESIzPMtLsRzG9BadhUJtaYD0YVxi4sqbZEvmoSC9sSS3ixSYSx0Aq0m9dCh8lOjRmSuwfPV8gl0+a/fqUW9MltSfbfpR+hU/mHPwV+0mRE9i2rfvS+Xydtxssq3LxsTTLY65DI52vOUDDeRYuyQaiUcQnlW9Qs6TQlQ8hlSud77fd/POGrHHkdscHE1YaGUYU0nFvhA8ssAojYOT+/unjZj9fLjnCz7Pj8WjW03zEztADGj8YYTDCDPyJVhf32Rry1SZvt10WC/rc/h5WombGF1ySwTu1G7sRLX/Nk92thVzGl9Djv24X8Gma58zNH5QU2iXkr64BMQjFYhF/Oc3xUeJ42selQnrhm5w/eKR06d2co0uFC8ILgHu/fyxuXPAyfwx8n8wkz/iYCLq8JLB9DP4tMgCmHXqYoVviTTieyv6GT9Ts9wW8LdDRBB9/CeC2d1AnSqGXuBFZgw/PfWYQstOYA9XiNvKPEfAZEGgL8pt64J/w9V8mSIEjUR8R8//hjhtWrLGGvIfn+hr24zcvOZs8o4OcKTye+UDHej5it+fBG6MyC8ga/sf63gD1Mnb1zcBytUZNV+kfH0vxKT7F94d8X8t/l/CRP7Tfh0I+jE8T6Xy4hBgu40Or5V1X11/IL+u66/L+Tn+oaFwRn+Wjl711wxeiSkgml4qu8yN30VaeUx+mP+ZDhhEJpf1UPFljufBNhv9vyKmvLnWWjxVJdJdEhoV5G7fc83HVC0ocjKRm7HJV3iO+BLzJDK5Y0gK2YeXsAZ9XQcOxKWe182H/3fWmyEv/yLPa9tSnRp41PbBd+q8cPRufO21C3LO8mZVA6fXJJ3xBPgWo7dvp7vv39dOwKOMbOK82IzqDIL3+/KR+D8Wg0DLrQ7PfV9X+Z5dnRZDOnf0L9fHnfOIPKdRag7DfBT1z/hX4KAwkV9sKfteKHvLJXf9wpa7PuGA/CY0NwjKALWUoZWJ9q5DQVC/ad7lMkv2yfjCQaMC0gT2RcxPqPMro01A9wrYk7+BuwQHP7D3AcRdmTKyvnrVFRdNpBVCh0uLo3cu+vZw0igEvDmSBDacxMVqrTr75jq5nYCcxTf9UYdAna3XrCjAbxaovqiqGoipLhsDBldXTrsUoa9+FA+2GrTjF1Zctk74Fizs3K3azGDPithJPMtD0EoTtoFIomw9THVaUXbx7XRWsn4jibghkP3HclQWDEvCXtjBSXG59VS0YsEaeEHqtrwfOd/dWvtd6iOmVD10E+ZK3W3hX9K3tL8TC3goViIFP+sa6G743j8dnVUpGhf99337vic+1uJepIBe+LWlIrBq6WT5Sg+Nl2+QDYY1pH6XgiFvkoy0Anp2N2o/Cdj94XmWjfDzdMPAOw0q+xJxDlmCUPvdr/bfrrFsQRCp2I8qw3uYe+iFiUVOEpu4W3Q9ESVFXVW3MlLNWl3jwO52teKwtJgpILzw/so76+tY2jaekpKSkpKSkpKSkpKQkRf8AusBIY2l/ztEAAAAASUVORK5CYII=" />
      <Typography
        variant="body1"
        sx={{
          // bgcolor: "#4E5652",
          // color: "#FFFFFF",
          color: "black",
          bgcolor:"#f7f7f7",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 3,
          fontSize: 18,
        }}
      >
        {isChat?(<Typewriter text={props.message} delay={9} />):( <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a key={key} href={decoratedHref} style={{ color: "#92b9e3" }}>
          {decoratedText}
        </a>
      )}
    >
      {props.message}
    </Linkify>)}
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
        whiteSpace: "pre-line",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          // bgcolor: "#25A18E",
          bgcolor: "#2cac24",
          color: "#FFFFFF",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 3,
          fontSize: 18,
          maxWidth: "65%"

        }}
      >
        {props.message}
      </Typography>
      <Avatar />
    </Box>
  );
};

const ChatBotPage: React.FC = () => {
  const [chatID,setChatID]=useState<string>("")
  const { user } = useAuth0();
  const [chatHistory,setChatHistory] =React.useState<IChatData[]>(mockData);
  const [chatData, setChatData] = React.useState<IChatData[]>(chatHistory);
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [suggestion, setSuggestion] = React.useState<string[]>(initialTag);
  const [trackServer, setTrackServer] = React.useState([]);
  const [isChat,setIsChat]=React.useState(false);
  const [historyLength,setHistoryLength]=React.useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleHistory=(value:any)=>{
    setIsChat(false);
    const messageTags=value.history.map((history,idx)=>{
    return {sender:history.role,message: history.content};
    })
    
    setChatHistory(messageTags)
    setChatID(value.chat_id)
    console.log(messageTags);
    setChatData(messageTags);
    scrollToBottom();
  }
  useEffect(()=>{
    scrollToBottom();
  },[chatHistory,suggestion,chatData])
  useEffect(()=>{
    setHistoryLength((p:number)=>{
      return p + 1;
    })
  },[chatID])
  const handleDelete=(value:any)=>{
    console.log(value)
    deleteChat(value.chat_id)
    setHistoryLength((p:number)=>{
      return p + 1;
    })
  };

  const handleChat = (value?: string) => {
    setIsChat(true);
    // setMessage(value);
    chatHistory.push({ sender: "user", message: value ?? message });
    setChatData([...chatHistory]);
    setIsLoading(true);
    scrollToBottom();
    if (!Boolean(value)) setMessage("");

    getChatResponse(value ?? message, trackServer,chatID)
      .then((res) => {
        console.log(res);
        chatHistory.push({
          sender: "bot",
          message: res.response.answer,
        });
        setChatData([...chatHistory]);
        setTrackServer(res.response.history);
        setSuggestion(res.response.tag);
        setChatID(res.chatID);
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
  const handleNewChat=()=>{
    setChatHistory([
      { sender: "bot", message: "Hello, How can I assist you?" },
    ])
    setChatID("");
     console.log([
      { sender: "bot", message: "Hello, How can I assist you?" },
    ])
    setChatData([
      { sender: "bot", message: "Hello, How can I assist you?" },
    ])
    setTrackServer([])
  }

  React.useEffect(() => {
    console.log("====================================");
    console.log("user");
    console.log(user);
    console.log("====================================");
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{}}>
        <Box
          sx={{
            width: "100%",
            height: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 700,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <HistoryPanel isOpen = {isOpen} setIsOpen= {setIsOpen} historyLength={historyLength} handleHistory={handleHistory} handleNewChat={handleNewChat} handleDelete={handleDelete} />
            <Box
              sx={{
                width: isOpen? "80%":"100%",
                height: "100%",

                // boxShadow: 3,
                // borderRadius: 2,
                
                // overflow: "auto",
                // scrollbarWidth: "thin",
                WebkitOverflowScrolling: {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "6%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  border: .5,
                  color: "#E9EAEC",
                  // background:
                  //       "linear-gradient(315deg, #378b29 0%, #18a428 74%)",
                  // background: "#28a820"
                  background: "#f7f7f7",
                }}>
                <Box sx={{ 
                    height:"100%",
                    width:"5%",
                    // background: "#28a820"
                    background: "#f7f7f7",
                  }}>
                  {!isOpen && <IconButton onClick={handleToggle}>
                    <ViewSidebarIcon />
                  </IconButton>}
                  </Box>
                <Typography
                  sx={{
                    width:"95%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    // background:
                    //   "linear-gradient(315deg, #378b29 0%, #18a428 74%)",
                    // background: "#28a820",
                    background: "#f7f7f7",
                    fontSize: "35px",
                    height: "100%",
                    // borderRadius: "4px",
                    fontWeight: "bold",
                    // color: "#e3e0e0",
                    color: "#005f06"
                    // boxShadow: 3,
                  }}
                >
                  Learning Assistant
                </Typography> 
              </Box>
              <Box
                sx={{
                  display:"flex",
                  height: "80%",
                  width: "100%",
                  padding: 1,
                  justifyContent: "space-around",
                  alignItems: "center",
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                  // WebkitOverflowScrolling: {
                  //   display: "none",
                  // },
                }}
                id={`box-${chatID}`}
              >
                <Box
                sx={{
                  height: "100%",
                  padding: 1,
                  width:1150,
                  // WebkitOverflowScrolling: {
                  //   display: "none",
                  //},
                }}
              >
                {chatData.map((data: IChatData, idx: number) => {
                  return data.sender === "bot"||data.sender === "assistant" ? (
                    <BotText  props={data} isChat={isChat && idx===chatData.length-1}/>
                  ) : (
                    data.sender==="user" && <UserText message={data.message} />
                  );
                })}

                {isLoading && <BotText props={loadingMessage} isChat={isChat}/>}
              </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap-reverse",
                  gap: 0.5,
                  p: 0.5,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "5%",
                }}
              >
                {suggestion.length !== 0 &&
                  !isLoading &&
                  suggestion.map((tag: string, idx: number) => {
                    if (tag.length !== 0)
                      return (
                        <SuggestedTag
                          value={tag}
                          handleClick={handleChat}
                          sx="5"
                          key={idx}
                        ></SuggestedTag>
                      );
                  })}
              </Box>
              <Box
                sx={{
                  height: "9%",
                  width: "100%",
                  display: "flex",
                  flexWrap: "nowrap",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box
                sx={{
                  height: "100%",
                  width: 1200,
                  display: "flex",
                  flexWrap: "nowrap",
                  justifyContent: "space-around",
                  alignItems: "center",
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
                          {
                            sender: "bot",
                            message: "Hello, How can I help you?",
                          },
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
                      // borderBlockStart: "1px",
                    // borderBlockEndColor: "#005f06",
                    borderColor: "#005f06",
                    outline: 0,
                    width: 1000,
                    px: 1,
                    height: 50,
                    textAlign: "center",
                    borderRadius: "20px",
                    
                    // boxShadow: "3",
                    background: "#fff",
                    "::placeholder": "bold",
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
                ></OutlinedInput>
                <Button
                  onClick={() => {
                    // handleChat();
                    handleChat();
                  }}
                >
                  <SendIcon />
                </Button>
              </Box></Box>
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
  const [currentText, setCurrentText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
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
        <a key={key} href={decoratedHref} style={{ color: "#92b9e3" }}>
          {decoratedText}
        </a>
      )}
    >
      {currentText}
    </Linkify>
  );
};
export default ChatBotPage;
