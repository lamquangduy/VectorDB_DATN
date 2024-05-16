import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";

import { Grid } from "@mui/material";
interface IChatData {
  sender?: string;
  message: string;
}
interface SuggestedTagProps {
  value: string;
  handleClick: (value: string) => void;
}

var mockData: IChatData[] = [
  { sender: "bot", message: "Hello, How can I help you?" },
];
const SuggestedTag: React.FC<SuggestedTagProps> = ({ value, handleClick }) => {
  return (
    <Grid item xs={6}>
      <Button
        sx={{
          border: 0,
          outline: 0,
          textAlign: "center",
          width: "100%",
        }}
        onClick={() => {
          handleClick(value);
        }}
      >
        <Typography
          variant="body1"
          sx={{
            bgcolor: "#f2f2f2",
            borderRadius: "10px",
            overflow: "hidden",
            p: 1,
            m: 0,
            fontSize: "0.8rem", // Kích thước nhỏ hơn
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", // Box shadow cố định
            "&:hover": {
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)", // Box shadow tăng lên khi hover
            },
          }}
        >
          {value}
        </Typography>
      </Button>
    </Grid>
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
      }}
    >
      <Avatar src="data:image/png;base64,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" />
      <Typography
        variant="body1"
        sx={{
          bgcolor: "#f2f2f2",
          borderRadius: "10px",
          overflow: "hidden",
          p: 2,
          m: 1,
          boxShadow: 1,
        }}
      >
        {props.message}
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
      }}
    >
      <Typography
        variant="body1"
        sx={{
          bgcolor: "#87B23C",
          color: "#FFFFFF",
          borderRadius: "10px",
          overflow: "hidden",
          p: 2,
          m: 1,
          boxShadow: 1,
        }}
      >
        {props.message}
      </Typography>
      <Avatar />
    </Box>
  );
};

const ChatBotPage: React.FC = () => {
  const [chatData, setChatData] = React.useState<IChatData[]>(mockData);
  const [message, setMessage] = React.useState<string>("");

  React.useEffect(() => {
    document.documentElement.classList.toggle("fake-dark-mode");
  }, []);

  const handleChat = () => {
    // setMessage(value);
    setChatData((chatData) => {
      return [...chatData, { sender: "user", message }];
    });
    setMessage("");
    axios
      .post("http://localhost:8000/chat", {
        text: message,
      })
      .then((res) => {
        console.log(res.data.response);
        setChatData((chatData) => [
          ...chatData,
          {
            sender: "bot",
            message: res.data.response,
          },
        ]);
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "98%",
          height: "96%",
          display: "flex",
          gap: 2,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HistoryPanel />

        <Box
          sx={{
            width: "80%",
            height: "100%",
            backgroundColor: "#F8F8FF",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              height: 120,
              backgroundColor: "#019b01",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "#FFFFFF",
              }}
            >
              Chatbot
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "calc(100% - 220px)",
              padding: 2,
              overflow: "auto",
            }}
          >
            {chatData.map((data: IChatData) => {
              return data.sender === "bot" ? (
                <BotText message={data.message} />
              ) : (
                <UserText message={data.message} />
              );
            })}
          </Box>

          {/* <Box>
            <List>
              <List sx={{ display: "flex" }}>
                <Avatar src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAACUCAMAAAC6AgsRAAAAaVBMVEX///8AAAD+/v7k5OTFxcWjo6PJycnc3NwwMDDn5+cEBAQKCgqUlJT7+/vf39/t7e3Q0NA4ODirq6v09PSEhIRJSUm3t7cXFxd0dHQSEhJcXFw9PT0pKSmamppjY2ONjY1RUVFra2sgICDBJTWpAAAGDklEQVR4nO2biZKiMBCGQ7jkCDcIiILz/g+56Q6MouBFHKja/LVrqYPho+kk3Z1AiJKSkpKSkpKSkpKSktJ/K7o2wKQo7cEoW5lkWpwvdRwnpBu1H0mTU6NVeWutDTIhbjwj1oT2GducCRktOJmL/zTtlK7Ncyd7L9CEsrVx7tQB3s+pLXMEjNbmuZENd7YCqrQE0mxjDmiC0QrwQxJ2/G3nrE00Ess4Ux7ybswHZx/6sL020kis5Ex1iOMM2tLblgNSsF8cgNMx/t7Vmm3ZjyTgfy2+tXe9LTcjbja9AsBjmqb2AfqvvzbTWJRkODzvTzlOI/stmQ/lHLR+coOXZG2cW1HidAJtk3ggPesn34OxNsqk+MxxAjxrm+EzDM0t8KWbC/6E2C/fOgZkXE8OQb4nB/EZ+jv2xWb1yJpXBLOwZjw6QidfzO9sX1su/yszM7cdOzavnN99dkBzTDHMkcwXnl85+Uv451B6F6esk4In2ujke+BRc6HlsjCWqCgF5FEmGtwLC9PHcvltgUibxzcWkVlGohgfayUfeukyMcjvuFqJPYS3lMJFH0LEW3SdHDCESIzPMtLsRzG9BadhUJtaYD0YVxi4sqbZEvmoSC9sSS3ixSYSx0Aq0m9dCh8lOjRmSuwfPV8gl0+a/fqUW9MltSfbfpR+hU/mHPwV+0mRE9i2rfvS+Xydtxssq3LxsTTLY65DI52vOUDDeRYuyQaiUcQnlW9Qs6TQlQ8hlSud77fd/POGrHHkdscHE1YaGUYU0nFvhA8ssAojYOT+/unjZj9fLjnCz7Pj8WjW03zEztADGj8YYTDCDPyJVhf32Rry1SZvt10WC/rc/h5WombGF1ySwTu1G7sRLX/Nk92thVzGl9Djv24X8Gma58zNH5QU2iXkr64BMQjFYhF/Oc3xUeJ42selQnrhm5w/eKR06d2co0uFC8ILgHu/fyxuXPAyfwx8n8wkz/iYCLq8JLB9DP4tMgCmHXqYoVviTTieyv6GT9Ts9wW8LdDRBB9/CeC2d1AnSqGXuBFZgw/PfWYQstOYA9XiNvKPEfAZEGgL8pt64J/w9V8mSIEjUR8R8//hjhtWrLGGvIfn+hr24zcvOZs8o4OcKTye+UDHej5it+fBG6MyC8ga/sf63gD1Mnb1zcBytUZNV+kfH0vxKT7F94d8X8t/l/CRP7Tfh0I+jE8T6Xy4hBgu40Or5V1X11/IL+u66/L+Tn+oaFwRn+Wjl711wxeiSkgml4qu8yN30VaeUx+mP+ZDhhEJpf1UPFljufBNhv9vyKmvLnWWjxVJdJdEhoV5G7fc83HVC0ocjKRm7HJV3iO+BLzJDK5Y0gK2YeXsAZ9XQcOxKWe182H/3fWmyEv/yLPa9tSnRp41PbBd+q8cPRufO21C3LO8mZVA6fXJJ3xBPgWo7dvp7vv39dOwKOMbOK82IzqDIL3+/KR+D8Wg0DLrQ7PfV9X+Z5dnRZDOnf0L9fHnfOIPKdRag7DfBT1z/hX4KAwkV9sKfteKHvLJXf9wpa7PuGA/CY0NwjKALWUoZWJ9q5DQVC/ad7lMkv2yfjCQaMC0gT2RcxPqPMro01A9wrYk7+BuwQHP7D3AcRdmTKyvnrVFRdNpBVCh0uLo3cu+vZw0igEvDmSBDacxMVqrTr75jq5nYCcxTf9UYdAna3XrCjAbxaovqiqGoipLhsDBldXTrsUoa9+FA+2GrTjF1Zctk74Fizs3K3azGDPithJPMtD0EoTtoFIomw9THVaUXbx7XRWsn4jibghkP3HclQWDEvCXtjBSXG59VS0YsEaeEHqtrwfOd/dWvtd6iOmVD10E+ZK3W3hX9K3tL8TC3goViIFP+sa6G743j8dnVUpGhf99337vic+1uJepIBe+LWlIrBq6WT5Sg+Nl2+QDYY1pH6XgiFvkoy0Anp2N2o/Cdj94XmWjfDzdMPAOw0q+xJxDlmCUPvdr/bfrrFsQRCp2I8qw3uYe+iFiUVOEpu4W3Q9ESVFXVW3MlLNWl3jwO52teKwtJgpILzw/so76+tY2jaekpKSkpKSkpKSkpKQkRf8AusBIY2l/ztEAAAAASUVORK5CYII=" />
                <Typography
                  variant="body1"
                  sx={{
                    bgcolor: "#f2f2f2",
                    borderRadius: "10px",
                    overflow: "hidden",
                    p: 2,
                    m: 1,
                    boxShadow: 1,
                  }}
                >
                  Hello, How can I help you?
                </Typography>
              </List>
              <List>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      bgcolor: "#87B23C",
                      borderRadius: "10px",
                      overflow: "hidden",
                      p: 2,
                      m: 1,
                      boxShadow: 1,
                    }}
                  >
                    I want to learn basic Python, with course should I take?
                  </Typography>
                </Box>
              </List>
            </List>
          </Box> */}
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <SuggestedTag
              value="which Java courses would you recommend for beginners?"
              handleClick={handleChat}
            />
            <SuggestedTag
              value="which skill does the course name IBM Applied DevOps Engineering Professional Certificate have?"
              handleClick={handleChat}
            />
            <SuggestedTag
              value="Tell me more about your ability"
              handleClick={handleChat}
            />
            <SuggestedTag value="Hello" handleClick={handleChat} />
          </Box>
          <Box
            sx={{
              // position: "absolute",
              // bottom: 20,
              width: "100%",
              // borderTop: 1,
              // p: 1,
              // m: 3,
            }}
          >
            <Button
              onClick={() => {
                setChatData(() => {
                  return [];
                });
                setTimeout(() => {
                  setChatData(() => {
                    return [
                      { sender: "bot", message: "Hello, How can I help you?" },
                    ];
                  });
                }, 3000);
              }}
            >
              <DeleteIcon />
            </Button>
            <OutlinedInput
              sx={{
                border: 0,
                outline: 0,
                width: "90%",
                p: 1,
                textAlign: "center",
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
            />
            <Button onClick={handleChat}>
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBotPage;
