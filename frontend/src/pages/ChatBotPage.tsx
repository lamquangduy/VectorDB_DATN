import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";

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
        }}
      >
        <Box
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
        </Box>
        <Box
          sx={{
            width: "80%",
            height: "100%",
            backgroundColor: "#F8F8FF",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "#000000",
              textAlign: "center",
            }}
          >
            Chat goes here
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBotPage;
