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
import { Tooltip } from '@mui/material';


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
            {[{'dir':'Collections',"tip":"Choose your document to use"}, {'dir':'Import','tip':'Add more information for chat bot'}].map((text, index) => (
              <ListItem key={text.dir} disablePadding>
                <ListItemButton onClick={()=>setSideBar(text.dir)}>
                  <ListItemIcon sx={{color:"green"}}>
                    {index % 2 === 0 ? <LibraryBooksIcon /> : <AddToPhotosIcon />}
                  </ListItemIcon>
                  <Tooltip title={text.tip}>
                    <Typography sx={{
                      fontWeight:"bold",
                      color:"green",
                      margin:0,
                      fontSize:20
                    }}>
                      {text.dir}
                    </Typography>
                    </Tooltip>
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
        {sideBar==="Collections" && <><Typography variant="h4">
                      Control your Document
                    </Typography><Collection/></>}
        {sideBar==="Import" && <><Typography variant="h4">
                      Add More Knowledge To Your VectorDB
                    </Typography><Import/></>}
      </Box>
    </Box>
  );
}