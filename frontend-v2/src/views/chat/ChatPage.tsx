import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import {
  deleteChat,
  // getChatRole,
} from "../../services/chat/chat";
import { getChatHistory } from "../../services/chat/chat";
import Linkify from "react-linkify";
import {
  createTheme,
  Divider,
  IconButton,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import ChatCard from "./components/ChatCard";
import { OpenInNew } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { List } from "echarts";
import { useNavigate } from "react-router-dom";
import InProgress from "./components/InProgress";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

interface IChatData {
  role?: string;
  content: string;
}
interface ChatTag {
  props: IChatData;
  isChat: boolean;
  isLoading: number;
  setIsLoading: (value: number) => void;
}
interface SuggestedTagProps {
  value: string;
  handleClick: (value: string) => void;
  sx?: any;
  delay: any;
}
const initialTag = [
  "Khoá học dành cho Backend",
  "Khoá học Python dành cho Data Science",
  "Khoá học lập trình cơ bản",
];
const scrollToBottom = () => {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
    // console.log(chatBox.scrollTop,":",chatBox.scrollHeight)
  }
};


const mockData: IChatData[] = [
  { role: "bot", content: "Xin chào, bạn cần hỗ trợ gì?" },
];

const renderTextWithBoldAndLinks = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)|(\[.*?\]\(.*?\))/);
  return parts.map((part, index) => {
    if (part && part.startsWith("**") && part.endsWith("**")) {
      return (
        <span
          key={index}
          style={{ fontWeight: "bold", fontFamily: "Montserrat", fontSize: 18 }}
        >
          {part.slice(2, -2)}
        </span>
      );
    } else if (part && part.startsWith("[") && part.endsWith(")")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
          target="_blank"
            key={index}
            href={match[2]}
            style={{ color: "#92b9e3", fontFamily: "Montserrat", fontSize: 18 }}
          >
            {match[1]}
          </a>
        );
      }
    } else {
      return part;
    }
  });
};

const loadingcontent: IChatData = { role: "bot", content: "Loading..." };
// const SuggestedTag: React.FC<SuggestedTagProps> = ({
//   value,
//   handleClick,
//   sx,
// }) => {
//   return (
//     <Box sx={sx}>
//       <Button
//         sx={{
//           height: 25,
//           border: 0.5,
//           //   outline: 0,
//           margin: 0.5,
//           display: "flex",
//           justifyContent: "space-between",
//           width: "auto",
//           borderRadius: 20,
//           "&:hover": {
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
//           },
//         }}
//         onClick={() => {
//           handleClick(value);
//         }}
//       >
//         <Typography
//           variant="body1"
//           sx={{
//             borderRadius: "10px",
//             overflow: "hidden",
//             p: 1,
//             textTransform: "capitalize",
//             fontSize: "0.8rem",
//             // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
//             // "&:hover": {
//             //   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
//             // },
//           }}
//         >
//           {value}
//         </Typography>
//       </Button>
//     </Box>
//   );
// };
import { keyframes } from "@emotion/react";
// import useCustomMediaQuery from "@hooks/useCustomMediaQuery";
// import ConfirmNotification from "./components/ConfirmNofication";
// import { log } from "console";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SuggestedTag: React.FC<SuggestedTagProps> = ({
  value,
  handleClick,
  sx,
  delay, // Add a delay prop to control the staggered effect
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box sx={sx}>
      <Button
        sx={{
          height: 25,
          border: 0.5,
          margin: 0.5,
          display: "flex",
          justifyContent: "space-between",
          width: "auto",
          borderRadius: 20,
          opacity: visible ? 1 : 0,
          animation: `${fadeIn} 0.5s ease-out forwards`,
          animationDelay: `${delay}ms`,
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          },
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
            fontSize: 12,
          }}
        >
          {value}
        </Typography>
      </Button>
    </Box>
  );
};
interface HistoryPanel {
  user: string | undefined;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  handleHistory: (value: MouseEvent) => void;
  handleNewChat: (value: any) => void;
  handleDelete: (value: MouseEvent) => void;
  action: string;
}

const HistoryPanel: React.FC<HistoryPanel> = ({
  user,
  isOpen,
  setIsOpen,
  handleHistory,
  handleNewChat,
  handleDelete,
  action,
}) => {
  const [historyList, setHistoryList] = useState<List[]>();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  useEffect(() => {
    console.log(user)
    const fetchChatHistory = async () => {
      const chatHistory = await getChatHistory(user);
      setHistoryList(chatHistory);
      // console.log(selectedIndex)
      // console.log(chatHistory[0]);
    };

    fetchChatHistory();
    // setSelectedIndex(null);
    switch (action) {
      case "create":
        setSelectedIndex(null);
        break;
      case "deleteCur":
        setSelectedIndex(null);
        break;
      case "swap":
        console.log("swap");
        break;
      case "newID":
        setSelectedIndex(0);
        break;
    }
    

  }, [action, selectedIndex]);

  const handleItemClick = (index: number) => {
    setSelectedIndex(() => index);
    console.log(selectedIndex);
  };
  const handleToggle = () => {
    setIsOpen(false);
  };

  return (
    <Box
      sx={{
        // borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // backgroundColor: "whitesmoke",
        visibility: !isOpen ? "hidden" : "visible",
        width: !isOpen ? "0%" : "20%",
        height: "100%",
        border: 0.5,
        borderRight: 0,
        color: "#018D36",
        // marginTop: 4,
      }}
    >
      <Box
        sx={{
          height: "6%",
          width: "100%",
          background: "#018D36",
          display: "flex",
        }}
      >
        <IconButton onClick={handleToggle}>
          <Tooltip title="Show/hide Chat History">
            <Box
              component="img"
              sx={{
                width: "20px",
                height: "20px",
              }}
              src={"/img/sidebar.svg"}
            ></Box>
          </Tooltip>
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "86%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderRight: 0.5,
            borderRightColor: "#2E8B57",
            // border: 0.5,
            color: "#234D20",
            // background: "#28a820",
            background: "#36802d",
          }}
        ></Box>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          {isOpen &&
            historyList
              ?.slice()
              .reverse()
              .map((history, idx) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: 56,
                      bgcolor: selectedIndex === idx ? "#d5edd3" : "#FFFFFF",
                      borderBottom: 1,
                      color: "#f1f2f2",
                      ":hover": {
                        backgroundColor:
                          selectedIndex === idx ? "#d5edd3" : "#f7f7f7",
                        boxShadow: selectedIndex === idx ? 3 : 1,
                        color: selectedIndex === idx ? "white" : "black",
                      },
                      // boxShadow: 3,

                      // flexGrow:1,
                    }}
                    onClick={() => {
                      handleItemClick(idx);
                    }}
                  >
                    <ChatCard
                      selectedIndex={selectedIndex}
                      setSelectedIndex={setSelectedIndex}
                      history={history}
                      idx={idx}
                      showHistory={handleHistory}
                      handleDelete={handleDelete}
                    ></ChatCard>
                    <Divider
                      sx={{
                        borderBottomWidth: 1,
                      }}
                    ></Divider>
                  </Box>
                );
              })}{" "}
        </Box>
      </Box>
      <Box
        sx={{
          height: "8%",
          width: "100%",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#018D36",
            color: "white",
            fontWeight: 800,
            width: "100%",
            height: "100%",
            ":hover": {
              backgroundColor: "#019b01",
            },
          }}
          onClick={handleNewChat}
        >
          <OpenInNew sx={{}}></OpenInNew>
          New Chat
        </Button>{" "}
      </Box>
    </Box>
  );
};

const BotText: React.FC<ChatTag> = ({
  props
}) => {
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
      <Avatar src="data:image/png;base64,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" />
      <Typography
        variant="body1"
        sx={{
          // bgcolor: "#4E5652",
          // color: "#FFFFFF",
          color: "black",
          bgcolor: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 2,
          fontSize: 18,
        }}
      >
        
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a
                key={key}
                href={decoratedHref}
                target="_blank"
                style={{
                  color: "#92b9e3",
                  fontFamily: "Montserrat",
                  fontSize: 18,
                  
                }}
              >
                <span style={{ fontFamily: "Montserrat", fontSize: 18 }}>
                  {decoratedText}
                </span>
              </a>
            )}
          >
            <span style={{ fontFamily: "Montserrat", fontSize: 18 }}>
              {renderTextWithBoldAndLinks(props.content)}
            </span>
          </Linkify>
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
          // bgcolor: "#2cac24",
          bgcolor: "#019b01",
          color: "#FFFFFF",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 3,
          fontSize: 18,
          maxWidth: "65%",
        }}
      >
        {props.content}
      </Typography>
      <Avatar />
    </Box>
  );
};

const ChatBotPage: React.FC = () => {
  const [chatID, setChatID] = useState<string>("");
  const { user } = useAuth0();
  const [chatHistory, setChatHistory] = React.useState<IChatData[]>(mockData);
  const [chatData, setChatData] = React.useState<IChatData[]>(chatHistory);
  const [content, setcontent] = React.useState<string>("");
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(0);
  const [suggestion, setSuggestion] = React.useState<string[]>(initialTag);
  const [isChat, setIsChat] = React.useState(false);
  const [action, setAction] = React.useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = React.useState<boolean>(false);
  // const useMediaQuery = useCustomMediaQuery();
  // const [isAuth, setIsAuth] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const [abortController, setAbortController] = useState(new AbortController());
  useEffect(() => {
    return () => {
      // Cleanup function to abort ongoing request
      abortController.abort();
    };
  }, []);
  // useEffect(() => {
  //   getChatRole(user?.email)
  //     .then((res) => {
  //       if (res === "admin") {
  //         setIsAuth(true);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);
  // useEffect(() => {
  //   console.log(user);
  //   if (user === null || user === undefined) {
  //     navigate("/login");
  //   }
  // }, [navigate, user]);
  interface ReadResult {
    done: boolean;
    value?: Uint8Array;
  }
  async function sendcontent(
    user: any,
    text: string,
    history: any[],
    chatId: string,
    signal: any
  ) {
    const endpoint =
      import.meta.env.VITE_APP_CHAT_SERVER_URL + `/chat/chat-stream/${user}`;
    var response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        history: history,
      }),
      signal: signal,
    })
    const length = chatHistory.length;
    var reader = response.body?.getReader();
    var decoder = new TextDecoder("utf-8");
    var content = "";
    // scrollToBottom();
    reader?.read().then(function processResult(result: ReadResult): any {
      setIsLoading(2);
      if (result.done) {
        const endpoint =
          import.meta.env.VITE_APP_CHAT_SERVER_URL +
          `/chat/handle-after-chat/${user}`;
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            history: chatHistory,
          }),
          signal: signal,
        })
          .then((res) => {
            return res.json(); // Giải mã nội dung JSON của phản hồi
          })
          .then((data) => {
            if (chatID === "") {
              setAction("newID");
              setChatID(data.chatID);
            }
            else
            setAction((p)=>p+1)

            setSuggestion(data.tag);
           
             setIsLoading(0);
            // scrollToBottom();
          }).catch((err) => {
               if(err.content==="canceled") return;
                chatHistory.push({
                  role: "bot",
                  content: err.content ?? "There is somethings wrong!!",
                });
                setChatData([...chatHistory]);
              });
          // scrollToBottom();
        return;
      }
      let token = decoder.decode(result.value);
      if (
        token.endsWith(".") ||
        token.endsWith("!") ||
        token.endsWith("?") ||
        token.endsWith(" ")
      ) {
        content += token;
        chatHistory[length] = {
          role: "assistant",
          content: content.trim(),
        };

        setChatData((p) => {
          p[length] = chatHistory[length];
          return p;
        });
        setAction((p) => p + 1);
      } else {
        
        content += token;
        chatHistory[length] = {
          role: "assistant",
          content: content.trim(),
        };
        setChatData((p) => {
          p[length] = chatHistory[length];
          return p;
        });
        setTimeout(scrollToBottom, 100);
        setAction((p) => p + 1);
      }
      setAction((p) => p + 1);
      return reader?.read().then(processResult);
    });
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleHistory = (value: any) => {
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 200);
    setIsChat(false);
    const contentTags = value.history.map(
      (history: { role: any; content: any }) => {

        return { role: history.role, content: history.content };
      }
    );
    
    // console.log("Handle History");
    setSuggestion(initialTag);
    setChatHistory(contentTags);
    setChatID(value.chat_id);
    // console.log(contentTags);
    setChatData(contentTags);
    setIsRefresh((p) => !p);
    // console.log("hoho");
    setTimeout(scrollToBottom, 500);

  }
  useEffect(() => {
    abortController.abort();
    setAction("swap");
    setIsLoading(0);
    // setTimeout(() => {
    //   setIsRefresh(p=>!p);
    // }, 300);
    // setIsRefresh(p=>!p)
    setTimeout(scrollToBottom, 500);
    // console.log(isLoading);
  }, [chatID]);
  const handleDelete = (value: any) => {
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 200);
    deleteChat(user?.email, value.chat_id);
    if (chatID === value.chat_id) {
      setChatHistory([
        { role: "assistant", content: "Xin chào, bạn cần hỗ trợ gì?" },
      ]);
      setChatID("");
      setChatData([
        { role: "assistant", content: "Xin chào, bạn cần hỗ trợ gì?" },
      ]);
      setSuggestion(initialTag);
      setAction("create");
    } else {
      setAction((p) => p + 1);
    }
    setIsRefresh((p) => !p);
  };
  useEffect(() => {
    // scrollToBottom();
    setTimeout(scrollToBottom, 100);
  }, [isLoading,suggestion]);

  const handleChat = (value?: string) => {
    if (value === undefined && content.length === 0) {
      return;
    }
    if (isLoading === 1) {
      return;
    }
    setIsChat(true);
    // setcontent(value);
    chatHistory.push({ role: "user", content: value ?? content });
    setChatData([...chatHistory]);
    setSuggestion([]);
    setIsLoading(1);
    // scrollToBottom();
    if (!Boolean(value)) setcontent("");
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    sendcontent(
      user?.email,
      value ?? content,
      chatData,
      chatID,
      newAbortController.signal
    );

    //  getChatResponse(user?.email, value ?? content, trackServer, chatID,newAbortController.signal)
    //   .then((res) => {
    //     console.log(res.response.answer)
    //     chatHistory.push({
    //       role: "bot",
    //       content: res.response.answer,
    //       // .replaceAll("*", ""),
    //     });

    //     setChatData([...chatHistory]);
    //     setTrackServer(res.response.history);
    //     setSuggestion(res.response.tag);
    //     if (chatID === "") {
    //       setAction("newID");
    //     }
    //     setChatID(res.chatID);
    //     setIsLoading(2);
    //     scrollToBottom();
    //   })
    //   .catch((err) => {
    //    if(err.content==="canceled") return;
    //     chatHistory.push({
    //       role: "bot",
    //       content: err.content ?? "There is somethings wrong!!",
    //     });
    //     setChatData([...chatHistory]);
    //   });
  };
  const handleNewChat = () => {
    abortController.abort();
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 200);
    setIsLoading(0);
    setChatHistory([{ role: "bot", content: "Xin chào, bạn cần hỗ trợ gì?" }]);
    setChatID("");
    setChatData([{ role: "bot", content: "Xin chào, bạn cần hỗ trợ gì?" }]);
    setSuggestion(initialTag);
    setAction("create");
    setIsRefresh((p) => !p);
  };

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
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingX: 10,
          }}
        >
          <Box
            sx={{
              width: "80vw",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",

              // overflowY:"scroll"
            }}
          >
            <HistoryPanel
              user={user?.email}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              action={action}
              handleHistory={handleHistory}
              handleNewChat={handleNewChat}
              handleDelete={handleDelete}
            />
            <Box
              sx={{
                width: "80%",
                height: "100%",
                padding: 0,
                margin: 0,
                border: 0.5,
                color: "#018D36",
              }}
            >
              <>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "6%",
                      width: "100%",
                      background: "#018D36",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        visibility: isOpen ? "hidden" : "visible",
                      }}
                    >
                      <IconButton onClick={handleToggle}>
                        <Tooltip title="Show/hide Chat History">
                          <Box
                            component="img"
                            sx={{
                              width: "20px",
                              height: "20px",
                            }}
                            src={"/img/sidebar.svg"}
                          ></Box>
                        </Tooltip>
                      </IconButton>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          width: "100%",
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#e3e0e0",
                          padding: 0,
                          margin: 0,
                          height: "100%",
                        }}
                      >
                        Learning Assistant
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/chat-admin");
                        }}
                        sx={{
                          visibility: "hidden",
                        }}
                      >
                        <Tooltip
                          title="Import Data"
                          sx={{
                            color: "#e3e0e0",
                            backgroundColor: "#e3e0e0",
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              width: "20px",
                              height: "20px",
                            }}
                            src={"/img/import.svg"}
                          ></Box>
                        </Tooltip>
                        <Typography
                          sx={{
                            marginX: 1,
                            color: "#e3e0e0",
                          }}
                        >
                          Import Data
                        </Typography>
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: "85%",
                      width: "100%",
                      overflowY: "scroll",
                      paddingX: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    id="chat-box"
                  >
                    
                    {isRefresh && (
                      <Box
                        sx={{
                          margin: "auto",
                        }}
                      >
                        <InProgress></InProgress>
                      </Box>
                    )}
                    {!isRefresh && (
                      <Box>
                        {chatData.map((data: IChatData, idx: number) => {
                          return data.role === "bot" ||
                            data.role === "assistant" ? (
                            <BotText
                              props={data}
                              isChat={isChat && idx === chatData.length - 1}
                              isLoading={isLoading}
                              setIsLoading={setIsLoading}
                            />
                          ) : (
                            data.role === "user" && (
                              <UserText content={data.content} />
                            )
                          );
                        })}
                        {isLoading === 1 && (
                          <BotText
                            props={loadingcontent}
                            isChat={isChat}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                          />
                        )}
                      </Box>
                    )}
                    {!isRefresh && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {suggestion.length !== 0 &&
                          isLoading === 0 &&
                          suggestion.map((tag: string, idx: number) => {
                            if (tag.length !== 0)
                              return (
                                <SuggestedTag
                                  value={tag}
                                  handleClick={handleChat}
                                  sx="5"
                                  key={idx}
                                  delay={idx * 100}
                                />
                              );
                          })}
                      </Box>
                    )}
                    
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
                        width: "100%",
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
                            role: "bot",
                            content: "Xin chào, bạn cần hỗ trợ gì?",
                          });
                          setChatData([]);
                          setTimeout(() => {
                            setChatData(() => {
                              return [
                                {
                                  role: "bot",
                                  content: "Xin chào, bạn cần hỗ trợ gì?",
                                },
                              ];
                            });
                          }, 500);
                        }}
                        disabled={isLoading === 0 ? false : true}
                      >
                        <Tooltip title="Remove current chat"><DeleteIcon /></Tooltip>
                      </Button>
                      <OutlinedInput
                        sx={{
                          // borderBlockStart: "1px",
                          // borderBlockEndColor: "#005f06",
                          borderColor: "#005f06",
                          outline: 0,
                          width: 1000,
                          px: 1,
                          height: 30,
                          textAlign: "center",
                          borderRadius: "20px",

                          // boxShadow: "3",
                          background: "#fff",
                          "::placeholder": "bold",
                        }}
                        onKeyDown={(e) => {
                          if (content !== "" && e.key === "Enter") {
                            handleChat();
                          }
                        }}
                        placeholder="Type a new content here"
                        value={content}
                        onChange={(e) => {
                          setcontent(e.target.value);
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
                    </Box>
                  </Box>
                </Box>
              </>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};


export default ChatBotPage;
