import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
  const [selectedMenu, setSelectedMenu] = useState<string>("Upload PDF");
  const [file, setFile] = useState<File | null>(null);

  const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file_upload", file);

    try {
      const endpoint = "http://localhost:8000/uploadfile/";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.log("Successful!");
      } else {
        console.error("Fail!");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            key={item.title}
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
            style={{ display: "none" }}
            onChange={handleInputFile}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => document.getElementById("file-input")?.click()}
            sx={{
              width: 160,
              height: 48,
            }}
          >
            CHOOSE FILES
          </Button>
          {file && (
            <Typography
              sx={{
                mt: 2,
                fontSize: 16,
              }}
            >
              Selected file: {file.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              width: 160,
              height: 48,
              mt: 2,
            }}
          >
            UPLOAD
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;