import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CustomChip from "./CustomChip";
import NavBar from "./NavBar";
import { SuccessStatus, ErrorStatus } from "./AlertStatus";
import { Language } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import {
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import InProgress from "./InProgress";

const validUrl = (str: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};
const supportedFile = ["pdf", "xls", "xlsx", "doc", "docx", "txt", "csv"];
const getFileType = (fileName: string) => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) {
    return "undefined";
  }
  const fileType = fileName.slice(lastDot + 1).toLowerCase();
  return fileType;
};
const getFileIcon = (fileName: string) => {
  const fileType = getFileType(fileName);
  const fileIcon = `/img/${fileType}.svg`;
  return fileIcon;
};

const Collection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isFile, setIsFile] = useState<boolean>(true);
  const [isValidInput, setIsValidInput] = useState<string>("");
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    if (file) {
      const fileType = getFileType(file.name);
      if (!supportedFile.includes(fileType)) {
        setFile(null);
        setIsValidInput("invalidFile");
        setTimeout(() => {
          setIsValidInput("");
        }, 3000);
      }
    }
  }, [file]);
  useEffect(() => {
    setFile(null);
    setIsValidInput("");
  }, [isFile]);
  const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
      console.log(getFileIcon(event.target.files[0].name));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    console.log(e.dataTransfer.files[0]);
    setIsOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };
  const handleInputUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  const handleSubmitUrl = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validUrl(url)) {
      setIsValidInput("invalidUrl");
      setTimeout(() => {
        setIsValidInput("");
      }, 3000);
      return;
    }
    try {
      const endpoint = import.meta.env.VITE_APP_CHAT_SERVER_URL + "/upload-url";
      setIsValidInput(() => "inProgress");
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ url: url }),
      });
      if (res.ok) {
        console.log("Successful!");
        setIsValidInput("validUrl");
        setFile(null);
        setTimeout(() => {
          setIsValidInput("");
        }, 3000);
      } else {
        console.error("Fail!");
      }
    } catch (error) {
      console.error(error);
      console.error("Fail!");
      setIsValidInput("notResponding");
      setFile(null);
      setTimeout(() => {
        setIsValidInput("");
      }, 3000);
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
    setIsValidInput("inProgress");
    try {
      const endpoint =
        import.meta.env.VITE_APP_CHAT_SERVER_URL + "/upload-file";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log("Successful!");
        setIsValidInput("validFile");
        setFile(null);
        setTimeout(() => {
          setIsValidInput("");
        }, 3000);
      } else {
        console.error("Fail!");
        setIsValidInput("");
      }
    } catch (error) {
      console.error(error);
      console.error("Fail!");
      setIsValidInput("notResponding");
      setFile(null);
      setTimeout(() => {
        setIsValidInput("");
      }, 3000);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "90%",
          height: "80%",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          backgroundColor: "white",
          margin: "auto",
          boxShadow: 3,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: 30,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Collections
            </Typography>
          </Box>
          <Divider
            sx={{
              borderBottomWidth: 3,
            }}
          ></Divider>
          <Box
            sx={{
              display: "flex",
              flexDirection:"column",
              width: "100%",
              boxShadow: 3,
              height: "70vh",
              background: "#F3F7FD",
            }}
          >
            <Box
            sx={{
                margin:2,
                display:"flex",
                justifyContent:"flex-start",
                alignItems:"center"
            }}>
            <OutlinedInput
                        sx={{
                          // borderBlockStart: "1px",
                          // borderBlockEndColor: "#005f06",
                          borderColor: "#005f06",
                          outline: 0,
                          width: 300,
                          px: 1,
                          height: 40,
                          textAlign: "center",
                          borderRadius: "10px",
                          // boxShadow: "3",
                          background: "#fff",
                          "::placeholder": "bold",
                        }}
                      >
                       
                      </OutlinedInput>
                      <Button sx={{
                        "::placeholder":{
                            backgroundColor:"none"
                        }
                      }}>
                      <SearchIcon/>
                      </Button>
            </Box>
            <Box
            sx={{
                display:"flex",

            }}>
              <Box
              sx={{
                backgroundColor:"green",
                width:300,
                height:60,
                margin:1
              }}>
                <Box
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}>
                  <Typography>db_test</Typography>
                </Box>
                <Divider></Divider>
                <Box
                sx={{
                 display:"flex",
                 justifyContent:"flex-end"
                }}>
                  <Button>DELETE</Button>
                </Box>
              </Box>
              <Box
              sx={{
                backgroundColor:"green",
                width:300,
                height:60,
                margin:1
              }}>
                <Box
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}>
                  <Typography>db_test</Typography>
                </Box>
                <Divider></Divider>
                <Box
                sx={{
                 display:"flex",
                 justifyContent:"flex-end"
                }}>
                  <Button>DELETE</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Collection;
