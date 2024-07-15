import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CustomChip from "./CustomChip";
import NavBar from "./NavBar";
import { SuccessStatus, ErrorStatus } from "./AlertStatus";
import { Language } from "@mui/icons-material";
import { Divider,  Input, InputAdornment, InputLabel } from "@mui/material";
import InProgress from "./InProgress";
import { getCurrentDocument, getDocuments } from '../../../services/chat/chat';
import ChooseDocument from "./ChooseDocument";
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
interface ListCollection {
  collection: string;
  count: number;
}

const Import: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isFile, setIsFile] = useState<boolean>(true);
  const [isValidInput, setIsValidInput] = useState<string>("");
  const [currentDocument,setCurrentDocuement]=useState("")
  const [listDocuments,setListDocuments]=useState<ListCollection[]>([])
  const [chooseDocument,setChooseDocument]=useState(false)
  useEffect(()=>{
    getDocuments().then((res)=>{
      setListDocuments(res);
    }).catch((err)=>{
      console.log(err.message)
    })
  },[]);
  useEffect(()=>{
    getCurrentDocument().then((res)=>{
      setCurrentDocuement(res);
    }).catch((err)=>{
      console.log(err.message)
    })
  },[])


  
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
  useEffect(()=>{
    setFile(null);
    setIsValidInput("")
  },[isFile])
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
    setChooseDocument(true)
    // try {
    //   const endpoint = import.meta.env.VITE_APP_CHAT_SERVER_URL + `/upload-url?index_name=${currentDocument}`;
    //   setIsValidInput(() => "inProgress");
    //   const res = await fetch(endpoint, {
    //     method: "POST",
    //     body: JSON.stringify({ url: url }),
    //   });
    //   if (res.ok) {
    //     console.log("Successful!");
    //     setIsValidInput("validUrl");
    //     setFile(null);
    //     setTimeout(() => {
    //       setIsValidInput("");
    //     }, 3000);
    //   } else {
    //     console.error("Fail!");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   console.error("Fail!");
    //   setIsValidInput("notResponding");
    //   setFile(null);
    //   setTimeout(() => {
    //     setIsValidInput("");
    //   }, 3000);
    // }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }
    setChooseDocument(true);
    // const formData = new FormData();
    // formData.append("file_upload", file);
    // setIsValidInput("inProgress");
    // try {
    //   const endpoint =
    //     import.meta.env.VITE_APP_CHAT_SERVER_URL + `/upload-file?index_name=${currentDocument}`;
    //   const res = await fetch(endpoint, {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (res.ok) {
    //     console.log("Successful!");
    //     setIsValidInput("validFile");
    //     setFile(null);
    //     setTimeout(() => {
    //       setIsValidInput("");
    //     }, 3000);
    //   } else {
    //     console.error("Fail!");
    //     setIsValidInput("");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   console.error("Fail!");
    //   setIsValidInput("notResponding");
    //   setFile(null);
    //   setTimeout(() => {
    //     setIsValidInput("");
    //   }, 3000);
    // }
  };

  return (
    <>
    {chooseDocument && <ChooseDocument chooseDocument={chooseDocument} setChooseDocument={setChooseDocument} currentDocument={currentDocument}
    listDocument={listDocuments} file={file} url={url} setFile={setFile} setIsValidInput={setIsValidInput}/>}
     <Box
              sx={{
                width: "90%",
                height: "80%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                backgroundColor: "white",
                margin:"auto",
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
                <Box sx={{
                  display:"flex",
                  justifyContent:"flex-start"
                }}>
                  <NavBar isFile={isFile} setIsFile={setIsFile}></NavBar>
                </Box>
                <Divider
                    sx={{
                      borderBottomWidth: 3,
                    }}
                  ></Divider>
      {isValidInput === "inProgress" && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            boxShadow: 3,
            height: "70vh",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            gap: 1,
            background: "#F3F7FD",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 3,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <InProgress></InProgress>
            <Typography
              sx={{
                fontSize: 20,
                marginTop: 5,
                fontWeight: "bold",
              }}
            >
              Embedding is inprogress...
            </Typography>
          </Box>
        </Box>
      )}
      {isValidInput !== "inProgress" &&
        (file ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              boxShadow: 3,
              height: "70vh",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              gap: 1,
              background: "#F3F7FD",
            }}
          >
            
            <Box
              sx={{
                width: "80%",
                height: "70%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 3,
                backgroundColor: isOver ? "#d0cbcb" : "white",
                borderRadius: 5,
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "40%",
                    fontSize: 20,
                    fontWeight:10,
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      marginY: 1,
                      width: "100%",
                      height: "70%",
                    }}
                    src={getFileIcon(file.name)}
                  ></Box>
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: "65%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      height: "30%",
                      width: "30%",
                      backgroundImage: "linear-gradient(135deg, #008aff, #86d472)",
                      color: "white",
                      fontWeight: 700,
                      marginY: 1,
                      ":hover": {
                        backgroundImage:
                          "linear-gradient(135deg, #488ecac5, #9cd18d)",
                      },
                    }}
                    onClick={handleSubmit}
                  >
                    Upload file
                  </Button>
                  <Button
                    sx={{
                      height: "30%",
                      width: "30%",
                      marginY: 1,
                      fontWeight: "medium",
                      fontSize: 17,
                      border: 1,
                      ":hover": {
                        backgroundColor: "white",
                        color: "#f14343",
                      },
                    }}
                    onClick={() => {
                      setFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              boxShadow: 3,
              height: "70vh",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              gap: 1,
              background: "#F3F7FD",
            }}
          >
                {isValidInput==="notResponding"&&
                <ErrorStatus title="Server is not responding. Please try later."></ErrorStatus>}
                {isValidInput === "invalidFile" && (
                  <ErrorStatus title="File is not supported"></ErrorStatus>
                )}
                {isValidInput === "invalidUrl" && (
                  <ErrorStatus title="Invalid URL"></ErrorStatus>
                )}
                {isValidInput === "validFile" && (
                  <SuccessStatus title="Upload file successfuly"></SuccessStatus>
                )}
                {isValidInput === "validUrl" && (
                  <SuccessStatus title="Upload URL successfuly"></SuccessStatus>
                )}
                {isFile ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "80%",
                      margin: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      backgroundColor: isOver ? "#d0cbcb" : "white",
                      borderRadius: 5,
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      id="file-input"
                      style={{ display: "none" }}
                      onChange={handleInputFile}
                    />
                    <Typography>
                      Drop your document here or
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: 17,
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#f14343",
                          },
                        }}
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                      >
                        browser file
                      </Button>
                    </Typography>
                    <Typography
                      sx={{
                        color: "#878484",
                      }}
                    >
                      Supported
                    </Typography>{" "}
                    <CustomChip></CustomChip>
                  </Box>
                ) : (
                  <>
                    {isValidInput === "inProgress" && (
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          boxShadow: 3,
                          height: "80%",
                          justifyContent: "center",
                          alignItems: "center",
                          // p: 2,
                          // gap: 1,
                          background: "#F3F7FD",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "80%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            borderRadius: 5,
                          }}
                        >
                          <InProgress></InProgress>
                          <Typography
                            sx={{
                              fontSize: 20,
                              marginTop: 5,
                              fontWeight: "bold",
                            }}
                          >
                            Embedding is inprogress...
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {isValidInput !== "inProgress" && (
                      <Box
                        sx={{
                          width: "100%",
                          height: "80%",
                          margin: "auto",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          backgroundColor: isOver ? "#d0cbcb" : "white",
                          borderRadius: 5,
                        }}
                      >
                        <InputLabel
                          htmlFor="input-with-icon-adornment"
                          sx={{
                            color: "black",
                          }}
                        >
                          Type your URL here
                        </InputLabel>
                        <Input
                          id="input-with-icon-adornment"
                          placeholder="Example: https://www.google.com/"
                          startAdornment={
                            <InputAdornment position="start">
                              <Language />
                            </InputAdornment>
                          }
                          sx={{
                            width: "70%",
                            marginY: 2,
                          }}
                          onChange={handleInputUrl}
                        />
                        <Button
                          sx={{
                            height: "50px",
                            width: "300px",
                            backgroundImage:
                              "linear-gradient(135deg, #008aff, #86d472)",
                            color: "white",
                            fontWeight: 700,
                            marginY: 1,
                            ":hover": {
                              backgroundImage:
                                "linear-gradient(135deg, #488ecac5, #9cd18d)",
                            },
                          }}
                          onClick={handleSubmitUrl}
                        >
                          Submit
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            
          
        ))}
        </Box>
        </Box>
    </>
  );
};

export default Import;
