import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import { List } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';


const ChatBotPage: React.FC = () => {
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
          paddingLeft: 70
        }}
      >
        {/* <Box
          sx={{
            width: "20%",
            height: "100%",
            backgroundColor: "#000000",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            History goes here
          </Typography>
        </Box> */}
        <Box
          sx={{
            width: "80%",
            height: "100%",
            backgroundColor: "#F8F8FF",
            boxShadow: 3,
            borderRadius: '30px',
            overflow: 'hidden'
          }}
        >
          <Box>
            <header>
              <Typography
                  variant="h2"
                  sx={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    p: 6,
                    bgcolor: '#019b01',
                  }}
                  >
                  Chatbot
                </Typography>
            </header>
            <Box>
                <List>
                  <List sx={{display: 'flex'}}>
                    <Avatar src="data:image/png;base64,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" />
                    <Typography 
                      variant="body1"
                      sx={{
                        bgcolor: '#f2f2f2',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        p: 2,
                        m:1,
                        boxShadow: 1,
                      }}
                    >Hello, How can I help you?</Typography>
                  </List>
                  <List>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{
                        bgcolor: '#87B23C',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        p: 2,
                        m:1,
                        boxShadow: 1,
                      }}
                    >I want to learn basic Python, with course should I take?</Typography>
                  </Box>
                  </List>
                </List>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom:20,
                width: '52%',
                borderTop: 1,
                p:1,
                m: 3,
              }}
            >   
              <Button><DeleteIcon sx={{m:2}}/></Button>
              <OutlinedInput 
                sx={{
                  border: 0,
                  outline: 0,
                  width: '85%',
                  p:1,
                  textAlign: 'center'
                }} 
                placeholder="Type a new message here" />
              <Button><SendIcon sx={{m:2}}/></Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBotPage;
