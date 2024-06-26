import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { InsertChart } from '@mui/icons-material';
import ChatAdminPage from '../AdminPage';
import Import from './Import';
import { useState } from 'react';
import Collection from './Collection';
import { Divider } from '@mui/material';
const drawerWidth = 200;
export default function AdminSideBar() {
  const [sideBar,setSideBar]=useState("Collection")
  return (
    <Box sx={{ display: 'flex',  }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          zIndex:1,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto',zIndex:1 }}>
          <List>
            {['Collections', 'Import'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                onClick={()=>setSideBar(text)}>
                  <ListItemIcon sx={{
                    color:"green"
                  }}>
                    {index % 2 === 0 ? <LibraryBooksIcon /> : <AddToPhotosIcon />}
                  </ListItemIcon>
                  <Typography sx={{
                    fontWeight:"bold",
                    color:"green",
                    margin:0,
                    fontSize:20
                  }}>
                    {text}
                  </Typography>
                </ListItemButton>
              </ListItem>
              
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1,margin: 0 }}>
        {sideBar==="Collections" && <Collection/>}
        {sideBar==="Import" && <Import/>}
      </Box>
    </Box>
  );
}