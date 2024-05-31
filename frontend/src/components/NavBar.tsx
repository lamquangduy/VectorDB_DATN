import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import { Divider } from '@mui/material';


export default function NavBar({isFile,setIsFile}) {
  const handleFile = () => {
   setIsFile(true)
  };
  const handleUrl = () => {
   setIsFile(false)
  };

  return (
    <List
      sx={{ width: '100%',
       maxWidth: 360,
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
      }}
      onClick={handleFile}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Import File" />
      </ListItemButton>
      <ListItemButton sx={{
        backgroundColor:isFile ?"#BBDEFB":"#1d649f",
        borderRadius:2,
        boxShadow: isFile? 3:1,
      }}
      onClick={handleUrl}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="Import URL" />
      </ListItemButton>
    </List>
  );
}