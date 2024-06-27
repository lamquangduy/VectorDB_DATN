import { Alert, AlertTitle } from '@mui/material'
import React from 'react'
interface AlertStatusProps {
   title:string
  }
export const ErrorStatus:React.FC<AlertStatusProps> = ({title}) => {
  return (
    <Alert severity="error"
   sx={{
    position:"fixed",
    height:'80px',
    right:0,
    top:80,
    minWidth:"300px"
  }}>
      <AlertTitle>Error</AlertTitle>
        {title}
    </Alert>
  )
}
export const SuccessStatus:React.FC<AlertStatusProps> = ({title}) => {
    return (
      <Alert severity="success"
     sx={{
      position:"fixed",
      height:'80px',
      right:0,
      top:80,
      minWidth:"300px"
    }}>
        <AlertTitle>Success</AlertTitle>
          {title}
      </Alert>
    )
  }
