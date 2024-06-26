import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SearchIcon from '@mui/icons-material/Search';
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { changeCurrentDocument, deleteDocument, getCurrentDocument, getDocuments } from "../../../services/chat/chat";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InProgress from "./InProgress";


const Collection: React.FC = () => {
const [listDocument,setListCollection]=useState([]);
const [status,setStatus]=useState("");
const [isRefresh,setIsRefresh]=useState(false);
const [currentDocument,setCurrentDocument]=useState("")
const [search,setSearch]=useState("")
  useEffect(()=>{
    setTimeout(() => {
      setIsRefresh(true);
    }, 200);
    getDocuments().then((res)=>{
      console.log(res)
      setListCollection(res)
    })
    setIsRefresh(false);
  },[status])
  useEffect(()=>{
    // setTimeout(() => {
    //   setIsRefresh(true);
    // }, 200);
    getCurrentDocument().then((res)=>{
      console.log(res)
      setCurrentDocument(res);
    })
    // setIsRefresh(false);
  },[status])
  const handleDelete =(value:string)=>{
    if(currentDocument===value){
      console.log("Can't delete")
      return;
    }
    deleteDocument(value).then((res)=>{
      setStatus(`Delete ${value}`);
      console.log(status)
    }).catch((err)=>{
      console.log(err.message);
    })
    
  }

  const handleChangeDocument=(value:string)=>{
    changeCurrentDocument(value).then((res)=>{
      console.log(res);
      setStatus(`Change Document: ${value}`);
    }).catch((err)=>{
      console.log(err.message);
    });
  }
  
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
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
                justifyContent:"space-between",
                alignItems:"center"
            }}>
              <Box>
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
                        onChange={(e)=>{
                          setSearch(e.target.value)
                          setTimeout(()=>{
                            setIsRefresh(true)
                          },400)
                          setIsRefresh(false)
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
                      <Box>
                      <Typography sx={{
                        fontSize:15,
                        fontWeight:"bold"

                      }}>
                       {`Current Document: ${currentDocument}`}
                      </Typography>
                      </Box>
            </Box>
            {!isRefresh&&
            <Box 
            sx={{
              width:"100%",
              height:"100%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center"
            }}>
            <InProgress></InProgress>
            </Box>}
            {isRefresh&&<Box
            sx={{
                display:"flex",
                flexWrap:"wrap"
            }}>
              {listDocument.map((item:string,idx)=>{
                if(search.length && !item.includes(search)){
                  return ;
                }
                return (
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
                  <Typography>{item}</Typography>
                </Box>
                <Divider></Divider>
                <Box
                sx={{
                 display:"flex",
                 justifyContent:"space-between",
                 paddingX:1
                }}>
                    <Button 
                  sx={{
                    color:"black"
                }}
                  onClick={()=>handleChangeDocument(item)}>USE THIS</Button>
                  <Button sx={{
                      color:"black"
                  }}
                  onClick={()=>handleDelete(item)}>DELETE</Button>

                </Box>
              </Box>
                )
              })}
               <Box
              sx={{
                backgroundColor:"green",
                width:300,
                height:60,
                margin:1,
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column"
              }}
              >
                <Button>
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                </Button>
                <Typography>New Document</Typography>
              </Box>
            </Box>}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Collection;
