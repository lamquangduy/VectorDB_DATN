import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import getChatResponse, {
  deleteChat,
  getChatRole,
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
  sender?: string;
  message: string;
}
interface ChatTag {
  props: IChatData;
  isChat: boolean;
}
interface SuggestedTagProps {
  value: string;
  handleClick: (value: string) => void;
  sx?: any;
}
const initialTag = [
  "Khoá học lập trình cơ bản",
  "Khoá học Python dành cho Data Science",
  "Tôi cần thông tin về khoá học",
];

const scrollToBottom = () => {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};
const mockData: IChatData[] = [
  { sender: "bot", message: "Xin chào, bạn cần hỗ trợ gì?" },
];
const loadingMessage: IChatData = { sender: "bot", message: "Loading..." };
const SuggestedTag: React.FC<SuggestedTagProps> = ({
  value,
  handleClick,
  sx,
}) => {
  return (
    <Box sx={sx}>
      <Button
        sx={{
          height: 25,
          border: 0.5,
          //   outline: 0,
          margin: 0.5,
          display: "flex",
          justifyContent: "space-between",
          width: "auto",
          borderRadius: 20,
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
        console.log("delete");
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
        color: "#36802d",
        // marginTop: 4,
      }}
    >
      <Box
        sx={{
          height: "6%",
          width: "100%",
          background: "#36802d",
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
          height: "100%",
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

        <Box
          sx={{
            height: "8%",
            width: "100%",
          }}
        >
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
          </Button>{" "}
        </Box>
      </Box>
    </Box>
  );
};

const BotText: React.FC<ChatTag> = ({ props, isChat }) => {
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
          bgcolor: "#f7f7f7",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 3,
          fontSize: 14,
        }}
      >
        {isChat ? (
          <Typewriter text={props.message} delay={9} />
        ) : (
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a key={key} href={decoratedHref} style={{ color: "#92b9e3" }}>
                {decoratedText}
              </a>
            )}
          >
            {props.message}
          </Linkify>
        )}
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
          bgcolor: "#097969",
          color: "#FFFFFF",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          overflow: "hidden",
          m: 1,
          padding: 1,
          boxShadow: 3,
          fontSize: 14,
          maxWidth: "65%",
        }}
      >
        {props.message}
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
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [suggestion, setSuggestion] = React.useState<string[]>(initialTag);
  const [trackServer, setTrackServer] = React.useState([]);
  const [isChat, setIsChat] = React.useState(false);
  const [action, setAction] = React.useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = React.useState<boolean>(false);
  const [isAuth, setIsAuth] = React.useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getChatRole(user?.email)
      .then((res) => {
        if (res === "admin") {
          setIsAuth(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // useEffect(() => {
  //   console.log(user);
  //   if (user === null || user === undefined) {
  //     navigate("/login");
  //   }
  // }, [navigate, user]);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleHistory = (value: any) => {
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 2000);
    setIsChat(false);
    const messageTags = value.history.map(
      (history: { role: any; content: any }) => {
        return { sender: history.role, message: history.content };
      }
    );
    console.log("Handle History");
    setSuggestion(initialTag);
    setChatHistory(messageTags);
    setChatID(value.chat_id);
    console.log(messageTags);
    setChatData(messageTags);
    scrollToBottom();
    setIsRefresh((p) => !p);
    setTrackServer(value.history);
  };
  useEffect(() => {
    setAction("swap");
  }, [chatID]);
  const handleDelete = (value: any) => {
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 3000);
    deleteChat(user?.email, value.chat_id);
    if (chatID === value.chat_id) {
      setChatHistory([
        { sender: "bot", message: "Xin chào, bạn cần hỗ trợ gì?" },
      ]);
      setChatID("");
      setChatData([{ sender: "bot", message: "Xin chào, bạn cần hỗ trợ gì?" }]);
      setTrackServer([]);
      setSuggestion(initialTag);
      setAction("create");
    } else {
      setAction((p) => p + 1);
    }
    setIsRefresh((p) => !p);
  };
  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const handleChat = (value?: string) => {
    if (value === undefined && message.length === 0) {
      return;
    }
    if (isLoading === true) {
      return;
    }
    setIsChat(true);
    // setMessage(value);
    chatHistory.push({ sender: "user", message: value ?? message });
    setChatData([...chatHistory]);
    setIsLoading(true);
    scrollToBottom();
    if (!Boolean(value)) setMessage("");

    getChatResponse(user?.email, value ?? message, trackServer, chatID)
      .then((res) => {
        console.log(res);
        chatHistory.push({
          sender: "bot",
          message: res.response.answer.replaceAll("*", ""),
        });

        setChatData([...chatHistory]);
        setTrackServer(res.response.history);
        setSuggestion(res.response.tag);
        if (chatID === "") {
          setAction("newID");
        }
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
  const handleNewChat = () => {
    setTimeout(() => {
      setIsRefresh((p) => !p);
    }, 2000);
    setChatHistory([
      { sender: "bot", message: "Xin chào, bạn cần hỗ trợ gì?" },
    ]);
    setChatID("");
    setChatData([{ sender: "bot", message: "Xin chào, bạn cần hỗ trợ gì?" }]);
    setTrackServer([]);
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
              width: "100%",
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
                color: "#36802d",
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
                      background: "#36802d",
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
                          fontSize: "20px",
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
                          visibility: isAuth ? "visible" : "hidden",
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
                      height: "90%",
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
                          return data.sender === "bot" ||
                            data.sender === "assistant" ? (
                            <BotText
                              props={data}
                              isChat={isChat && idx === chatData.length - 1}
                            />
                          ) : (
                            data.sender === "user" && (
                              <UserText message={data.message} />
                            )
                          );
                        })}
                        {isLoading && (
                          <BotText props={loadingMessage} isChat={isChat} />
                        )}
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
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
                              />
                            );
                        })}
                    </Box>
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
                            sender: "bot",
                            message: "Xin chào, bạn cần hỗ trợ gì?",
                          });
                          setChatData([]);
                          setTimeout(() => {
                            setChatData(() => {
                              return [
                                {
                                  sender: "bot",
                                  message: "Xin chào, bạn cần hỗ trợ gì?",
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
                          height: 30,
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
