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

interface ListCollection {
  collection: string;
  count: number;
}

const Collection: React.FC = () => {
const [listDocument,setListCollection]=useState<ListCollection[]>([]);
const [status,setStatus]=useState("");
const [isRefresh,setIsRefresh]=useState(true);
const [currentDocument,setCurrentDocument]=useState("undifined")
const [search,setSearch]=useState("")
const [createDocument,setCreateDocument]=useState(false);
const [isAlert,setIsAlert]=useState(false);
  useEffect(()=>{
    console.log(status)
    if(status.includes("Create document successfully") || status.includes("is exist"))
      {
    setTimeout(() => {
      setIsAlert((p)=>!p)
    }, 2000);
    setIsAlert((p)=>!p)}

    getDocuments().then((res)=>{
      setListCollection(res)
      setIsRefresh(false)
      setTimeout(() => {
        setIsAlert((p)=>!p)
      }, 2000);
      setIsAlert((p)=>!p)
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
    setIsRefresh(true);
    deleteDocument(value).then((res)=>{
      setStatus(`Delete ${value}`);
      console.log(res)
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
    }).catch((err)=>{
      console.log(err.message);
    });
  }
  
  return (
    <>
             {status.includes("Delete")&& isAlert&&
               <SuccessStatus title={`${status} successfully`}></SuccessStatus>}
                 {status.includes("Create")&& isAlert&&
               <SuccessStatus title={`${status}`}></SuccessStatus>}
                {status.includes("Document is in use")&& isAlert&&
               <ErrorStatus title={`${status}`}></ErrorStatus>}
                {status.includes("is exists")&& isAlert&&
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
                justifyContent:"center",
                overflowY:"auto",
            }}>
              {listDocument.map((item:ListCollection)=>{
                if(search.length && !item.collection.includes(search)){
                  return ;
                }
                return (
                  <Box
              sx={{
                backgroundColor:"white",
                border:1,
                borderColor: "whitesmoke",
                width:"30%",
                height:120,
                margin:"1%",
                borderRadius: 2,
                boxShadow: 2
              }}>
                <Box
                sx={{
                    display:"flex",
                    justifyContent:"center",
                    height: 40
                }}>
                  <Typography sx={{fontSize:18, marginTop:1}}>{item.collection}</Typography>
                </Box>
                <Divider sx={{margin: "4%"}}></Divider>
                <Box
                sx={{
                 display:"flex",
                 justifyContent:"space-between",
                 paddingX:1
                }}>

                    <Typography
                      sx={{
                        fontSize: 18,
                        
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color:"#008000",fontFamily: "Montserrat" }}>{"Points count: "} </span> {item.count}
                    </Typography>
                  <Box>
                    <Button 
                  sx={{
                    color:"#f14343",
                    border: 1,
                    borderColor: "#f14343",
                    marginRight: 2,

                    ":hover":{
                      backgroundColor: "red",
                      color: "white",
                    }
                }}
                  onClick={()=>handleDelete(item.collection)}>DELETE</Button>
                  <Button sx={{
                      color:"white",
                      backgroundImage: "linear-gradient(135deg, #008aff, #86d472)",
                      ":hover":{
                        backgroundImage:
                      "linear-gradient(135deg, #488ecac5, #9cd18d)",
                      }
                  }}
                  onClick={()=>handleChangeDocument(item.collection)}>Select</Button>
                  </Box>
                </Box>
              </Box>
                )
              })}
               {!isRefresh &&<Box
              sx={{
                backgroundColor:"white",
                border:1,
                boxShadow: 2,
                borderColor: "whitesmoke",
                width:"30%",
                height:120,
                margin:"1%",
                display:"flex",
                borderRadius: 2,
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"column",
              }}
              >
                {createDocument && <CreateDocument setIsRefresh={setIsRefresh} createDocument={createDocument} setCreateDocument={setCreateDocument} setStatus={setStatus} setIsAlert={setIsAlert}

                listDocument={listDocument}/>}
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
