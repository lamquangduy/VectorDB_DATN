import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import React from "react";
import UploadFileTwoToneIcon from "@mui/icons-material/UploadFileTwoTone";

interface IUploadBox {
  title: string;
  icon: string;
}

interface IUploadBoxProps extends IUploadBox {
  selected: boolean;
  onClick: () => void;
}

const UploadBox: React.FC<IUploadBoxProps> = (props: IUploadBoxProps) => {
  const { title } = props;
  return (
    <Box
      sx={{
        height: 80,
        width: "80%",
        border: "1px solid black",
        borderRadius: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: props.selected ? "primary.main" : "white",
        color: props.selected ? "white" : "black",
        cursor: "pointer",
      }}
      onClick={props.onClick}
    >
      <Typography>{title}</Typography>
    </Box>
  );
};
const listUpload: IUploadBox[] = [
  { title: "Upload PDF", icon: "" },
  { title: "Upload Word", icon: "" },
  { title: "Upload Excel", icon: "" },
  { title: "Upload CSV", icon: "" },
  { title: "Upload Text", icon: "" },
  { title: "Upload URL", icon: "" },
];
const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = React.useState<string>("Upload PDF");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",

        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {listUpload.map((item) => (
          <UploadBox
            title={item.title}
            icon={item.icon}
            selected={selectedMenu === item.title}
            onClick={() => setSelectedMenu(item.title)}
          />
        ))}
      </Box>
      <Box
        sx={{
          width: "80%",
          height: "100%",
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 900,
          }}
        >
          {selectedMenu}
        </Typography>
        <Box
          sx={{
            width: "50%",
            height: "30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "primary.main",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <Box>
            <UploadFileTwoToneIcon
              sx={{
                width: 60,
                height: 80,
              }}
            />
          </Box>
          <input
            type="file"
            id="file-input"
            style={{
              display: "none",
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              document.getElementById("file-input")?.click();
            }}
            sx={{
              width: 160,
              height: 48,
            }}
          >
            CHOOSE FILES
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
