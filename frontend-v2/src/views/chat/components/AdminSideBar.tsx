import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Import from './Import';
import Collection from './Collection';
import { useState } from 'react';


const drawerWidth = 200;

export default function AdminSideBar() {
   const [sideBar,setSideBar]=useState("Collections")
  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline/>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          zIndex:1
        }}
      >
        <Toolbar/>
        <Box sx={{ overflow: 'auto'}}>
          <List>
            {['Collections', 'Import'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={()=>setSideBar(text)}>
                  <ListItemIcon sx={{color:"green"}}>
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
        <List style={{ marginTop: `auto` }} >
          <Box sx={{
            backgroundColor:"green",
            height:"20%"
          }}></Box>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1,margin: 0}}>
        {sideBar==="Collections" && <Collection/>}
        {sideBar==="Import" && <Import/>}
      </Box>
    </Box>
  );
}