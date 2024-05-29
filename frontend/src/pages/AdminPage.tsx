import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import UploadFileTwoToneIcon from "@mui/icons-material/UploadFileTwoTone";
import { Avatar, Icon } from "@mui/material";
import { Image } from "@mui/icons-material";

interface IUploadBox {
  title: string;
  icon: string;
}

interface IUploadBoxProps extends IUploadBox {
  selected: boolean;
  onClick: () => void;
}

const UploadBox: React.FC<IUploadBoxProps> = (props: IUploadBoxProps) => {
  const { title,icon } = props;
  return (
    <Box
      sx={{
        height: 80,
        width: "80%",
        minWidth:160,
        borderRadius: 4,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: props.selected ? "primary.main" : "white",
        color: props.selected ? "white" : "black",
        cursor: "pointer",
        boxShadow:3,
        ":hover":{
          backgroundColor: props.selected ? "primary.main":"#dce7f4"
        }
      }}
      onClick={props.onClick}
    >
      <Box
      component="img"
      sx={{
        width:"38px",
        height:"40px"
      }}
      src={icon}
      ></Box>
      <Typography sx={{
        marginRight:3,
        fontSize:"20px",
        fontWeight:"bold",
        fontFamily:"inherit"
      }}>{title}</Typography>
    </Box>
  );
};

const listUpload: IUploadBox[] = [
  { title: "Upload PDF", icon: "/img/pdf.png" },
  { title: "Upload Word", icon: "/img/word.png" },
  { title: "Upload Excel", icon: "/img/excel.png" },
  { title: "Upload CSV", icon: "/img/csv.png" },
  { title: "Upload Text", icon: "/img/text.png" },
  { title: "Upload URL", icon: "/img/url.png" },
];

const validUrl= (str:string)=> {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Upload PDF");
  const [file, setFile] = useState<File | null>(null);
  const [url,setUrl]=useState<string>("");

  const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };
  const handleInputUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  };
  const handleSubmitUrl = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!validUrl(url)){
      console.log("Invalid URL!")
      return;
    }
    try {
      const endpoint = "http://localhost:8000/uploadurl/";
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ url: url }) ,
      });

      if (res.ok) {
        console.log("Successful!");
      } else {
        console.error("Fail!");
      }
    } catch (error) {
      console.error(error);
    }

  }

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
        boxShadow:3,
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
          borderLeft: "2px solid #D3D3D3",
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
        {selectedMenu ==='Upload URL'? 
        (<Box
          sx={{
            width: "50%",
            height: "30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#C1E4C1",
            borderRadius: 4,
            cursor: "pointer",
            
          }}
        >
         
          <input
            required
            type="text"
            id="file-input"
            onChange={handleInputUrl}
            style={{
              outline: 0,
              height:30,
              width:550,
              textAlign: "center",
              borderRadius:"8px",
              boxShadow:"1",
              background:'#f0eeee',
              marginBottom:20,
              fontSize:15
              
            }
          }
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitUrl}
            sx={{
              width: 160,
              height: 48,
            }}
          >
            LOAD
          </Button>
        </Box>
        ):(<Box
          sx={{
            width: "50%",
            height: "30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#C1E4C1",
            borderRadius: 4,
            cursor: "pointer",
            paddingY:20
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
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;