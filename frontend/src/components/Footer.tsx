import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
   <Box sx={{
    backgroundColor:"#F3F7FD",
    height:"5%"
   }}>
    <Divider sx={{
        borderBottomWidth:2
    }}></Divider>
    <Typography>
        @CopyRight SolDev
    </Typography>
   </Box>
  )
}

export default Footer