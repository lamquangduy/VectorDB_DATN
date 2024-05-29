import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import React from "react";
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
          backgroundColor: props.selected ? "primary.main":"#92B9E3"
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
        color:"#BOD4B8"
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
const AdminPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = React.useState<string>("Upload PDF");

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
            type="text"
            id="file-input"
            style={{
              borderBlockStart:"1px",
              outline: 0,
              height:30,
              width:550,
              textAlign: "center",
              borderRadius:"10px",
              boxShadow:"3",
              background:'#f0eeee',
              marginBottom:20,
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
        </Box>)
        }
      </Box>
    </Box>
  );
};

export default AdminPage;
