import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SearchIcon from '@mui/icons-material/Search';
import {
  Divider,
  OutlinedInput,
} from "@mui/material";
import { changeCurrentDocument, deleteDocument,  getCurrentDocument,  getDocuments } from "../../../services/chat/chat";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InProgress from "./InProgress";
import CreateDocument from "./CreateDocument";
import { ErrorStatus, SuccessStatus } from "./AlertStatus";


const Collection: React.FC = () => {
const [listDocument,setListCollection]=useState([]);
const [status,setStatus]=useState("");
const [isRefresh,setIsRefresh]=useState(true);
const [currentDocument,setCurrentDocument]=useState("undifined")
const [search,setSearch]=useState("")
const [createDocument,setCreateDocument]=useState(false);
const [isAlert,setIsAlert]=useState(false);
  useEffect(()=>{
    console.log(status)
    if(status.includes("Create document successfully"))
      {
    setTimeout(() => {
      setIsAlert((p)=>!p)
    }, 2000);
    setIsAlert((p)=>!p)}
    getDocuments().then((res)=>{
      setListCollection(res)
      setIsRefresh(false)
    })
    getCurrentDocument().then((res)=>{
      setCurrentDocument(res)
    }).catch((err)=>{
      console.log(err.message)
    })
  },[status])
  const handleDelete =(value:string)=>{
    console.log(value)
    if(currentDocument===value){
      setStatus(`Document is in use!`)
      
      setTimeout(() => {
        setIsAlert((p)=>!p)
      }, 2000);
      setIsAlert((p)=>!p)
      setIsRefresh(false)
      return;
    }
    setIsRefresh(p=>!p);
    deleteDocument(value).then((res)=>{
      setStatus(`Delete ${value}`);
      console.log(res)
      setIsRefresh(false)
      setTimeout(() => {
        setIsAlert((p)=>!p)
      }, 2000);
      setIsAlert((p)=>!p)
      setIsRefresh(false)
    }).catch((err)=>{
      console.log(err.message);
    })
  }

  const handleChangeDocument=(value:string)=>{
    setIsRefresh(true)
    changeCurrentDocument(value).then((res)=>{
      console.log(res);
      setStatus(`Change Document: ${value}`);
      setIsRefresh(false)
      setCurrentDocument(value)
      setTimeout(() => {
        setIsAlert((p)=>!p)
      }, 2000);
      setIsAlert((p)=>!p)
    }).catch((err)=>{
      console.log(err.message);
    });
  }
  
  return (
    <>
             {status.includes("Delete")&& isAlert&&
               <SuccessStatus title={`${status} successfully`}></SuccessStatus>}
                 {status.includes("Create")&& isAlert&&
               <SuccessStatus title={`${status} successfully`}></SuccessStatus>}
                {status.includes("Document is in use")&& isAlert&&
               <ErrorStatus title={`${status}`}></ErrorStatus>}
               {status.includes("Change")&& isAlert&&
               <SuccessStatus title={`Current Document is ${currentDocument}`}></SuccessStatus>}
               
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
              alignItems:"center", 
              marginLeft:"3%",
              height: "12%",
              textAlign:"center"
              
            }}
          >
            <Typography
              sx={{
                fontSize: 25,
                fontWeight: "bold",
                
              }}
            >
              Current in use: <span style={{ fontWeight: 'bold', color:"#008000",fontFamily: "Montserrat" }}>{currentDocument}</span>
              {/* {`Current: ${currentDocument}`} */}
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
                marginLeft:"3%",
                marginTop:1,
                marginBottom:2,
                marginRight:"3%",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
            }}>
              <Box sx={{width:"100%",display:"flex", borderRadius:2,
                alignItems:"center", 
                 height:55, background:"white"}}> 
            <OutlinedInput
                        sx={{
                          // borderBlockStart: "1px",
                          // borderBlockEndColor: "#005f06",
                          marginLeft:"1%",
                          marginRight:"1%",
                          borderColor: "#005f06",
                          outline: 0,
                          width: "33%",
                          px: 1,
                          height: "70%",
                          textAlign: "center",
                          borderRadius: "10px",
                          // boxShadow: "3",
                          background: "#fff",
                          "::placeholder": "bold",
                        }}
                        onChange={(e)=>{
                          setSearch(e.target.value)
                          }}
  
                      />
                      <Button sx={{
                        "::placeholder":{
                            backgroundColor:"none"
                        }
                      }}>
                      <SearchIcon/>
                      </Button>
                      </Box>
            </Box>
            {isRefresh&&
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
            {!isRefresh&&<Box
            sx={{
                display:"flex",
                flexWrap:"wrap",
                justifyContent:"center"
            }}>
              {listDocument.map((item:string)=>{
                if(search.length && !item.includes(search)){
                  return ;
                }
                return (
                  <Box
              sx={{
                backgroundColor:"white",
                border:1,
                borderColor: "whitesmoke",
                width:"30%",
                height:70,
                margin:"1%",
                borderRadius: 2
              
              }}>
                <Box
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}>
                  <Typography sx={{fontSize:18, marginTop:.5}}>{item}</Typography>
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
               {!isRefresh &&<Box
              sx={{
                backgroundColor:"white",
                border:1,
                borderColor: "whitesmoke",
                width:"30%",
                height:70,
                margin:"1%",
                display:"flex",
                borderRadius: 2,
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
              }}
              >
                {createDocument && <CreateDocument setIsRefresh={setIsRefresh} createDocument={createDocument} setCreateDocument={setCreateDocument} setStatus={setStatus} setIsAlert={setIsAlert}/>}
                <Button onClick={()=>{setCreateDocument(true)}}>
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                </Button>
                <Typography>New Document</Typography>
              </Box>}
              {Array.from(new Array(3-(listDocument.length%3))).map(()=>{
                return (
                  <Box
                  sx={{
                    backgroundColor:"green",
                    width:"30%",
                    height:70,
                    margin:"1%",
                    display:"flex",
                    borderRadius: 2,
                    justifyContent:"center",
                    alignItems:"center",
                    flexDirection:"column",
                    visibility:"hidden"
                  }}
                  >
                   
                  </Box>
                )
              })}
            </Box>}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Collection;
