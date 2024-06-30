import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addDocument } from '../../../services/chat/chat';

interface CreateDocument {
  createDocument:boolean,
  setCreateDocument:(value:boolean)=>void,
  setStatus:(value:string)=>void,
  setIsRefresh:(value:boolean)=>void,
  setIsAlert:(value:boolean)=>void,
  listDocument:string[]
};

const CreateDocument:React.FC<CreateDocument> =({createDocument,setCreateDocument,setStatus,setIsRefresh,setIsAlert,listDocument}) =>{

  const handleClose = () => {
   setCreateDocument(false)
  };

  return (
    <React.Fragment >
      <Dialog
        open={createDocument}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // console.log(event)
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            handleClose();
            setIsRefresh(true);
            if(listDocument.includes(email)){
              setStatus(`Document ${email} is exists`)
                setTimeout(() => {
                  setIsAlert(true)
                }, 2000);
                return;
            }

            addDocument(email).then((res)=>{
                setStatus(`Create document successfully ${res}`)
                setTimeout(() => {
                  setIsAlert(true)
                }, 2000);
                setIsAlert(false)
                setIsRefresh(false)
            }).catch((err)=>{
              setStatus(`${err.message}`)
              setTimeout(() => {
                setIsAlert(true)
              }, 2000);
                console.log(err.message)
            })
           
          },
        }}
      >

        <DialogTitle>New Document</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Document Name"
            type="text"
            fullWidth
            variant="standard"
            autoComplete='off'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default CreateDocument;