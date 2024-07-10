import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import { Tooltip } from '@mui/material';


interface NavBar{
  isFile:boolean,
  setIsFile: (value:boolean)=>void,
}

const NavBar:React.FC<NavBar>=({isFile,setIsFile})=> {
  const handleFile = () => {
   setIsFile(true)
  };
  const handleUrl = () => {
   setIsFile(false)
  };

  return (
    <List
      sx={{ width: '100%',
       maxWidth: 400,
    display:'flex',
    gap:"7px",
    marginLeft:3,
    }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton sx={{
        backgroundColor : isFile ?"#1d649f":"#BBDEFB",
        borderRadius:2,
        boxShadow: isFile? 1:3,
        color:isFile ? "white":"black",
        ":hover":{
          backgroundColor : isFile ?"#1d649f":"#f6f6f6",
        borderRadius:2,
        boxShadow: isFile? 1:3,
        color:isFile ? "white":"black",
        }
      }}
      onClick={handleFile}>
        <ListItemIcon>
          <DescriptionIcon
          sx={{
            color:isFile ? "white":"black"
          }} />
        </ListItemIcon>
        <Tooltip title="Choose your file to embedding">
        <ListItemText primary="Import File" />
        </Tooltip>
      </ListItemButton>
      <ListItemButton sx={{
        backgroundColor:isFile ?"#BBDEFB":"#1d649f",
        borderRadius:2,
        boxShadow: isFile? 3:1,
        color:isFile ? "black":"white",
        ":hover":{
          backgroundColor:isFile ?"#f6f6f6":"#1d649f",
        borderRadius:2,
        boxShadow: isFile? 3:1,
        color:isFile ? "black":"white",
        }
      }}
      onClick={handleUrl}>
        <ListItemIcon>
          <LinkIcon 
           sx={{
            color:isFile ? "black":"white"
          }}/>
        </ListItemIcon>
        <Tooltip title="Embedding text content of web">
        <ListItemText primary="Import URL" />
        </Tooltip>
      </ListItemButton>
    </List>
  );
}

export default NavBar;