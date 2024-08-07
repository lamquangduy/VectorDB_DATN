import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface ListCollection {
  collection: string;
  count: number;
}
interface ChooseDocument {
  chooseDocument: boolean;
  setChooseDocument: (value: boolean) => void;
  listDocument: ListCollection[];
  currentDocument: string;
  file: File | null;
  url: string;
  setFile: (value: File | null) => void;
  setIsValidInput: (value: any) => void;
}
const ChooseDocument: React.FC<ChooseDocument> = ({
  chooseDocument,
  setChooseDocument,
  listDocument,
  currentDocument,
  file,
  url,
  setFile,
  setIsValidInput,
}) => {
  const [age, setAge] = React.useState("");

  const handleClose = () => {
    setChooseDocument(false);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const handleEmbedding = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file_upload", file);
      formData.append("index_name",age)
      setIsValidInput("inProgress");
      try {
        const endpoint =
          import.meta.env.VITE_APP_CHAT_SERVER_URL +
          `/chat/upload-file/`;
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          console.log("Successful!");
          setIsValidInput("validFile");
          setFile(null);
          setTimeout(() => {
            setIsValidInput("");
          }, 3000);
        } else {
          console.error("Fail!");
          setIsValidInput("");
        }
      } catch (error) {
        console.error(error);
        console.error("Fail!");
        setIsValidInput("notResponding");
        setFile(null);
        setTimeout(() => {
          setIsValidInput("");
        }, 3000);
      }
    } else if (url.length)
      // URL
      try {
        const endpoint =
          import.meta.env.VITE_APP_CHAT_SERVER_URL +
          `/chat/upload-url/`;
          
        setIsValidInput(() => "inProgress");
        const res = await fetch(endpoint, {
          method: "POST",
          headers:{
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
             "Url": url,"index_name":age }),
        });
        if (res.ok) {
          console.log("Successful!");
          setIsValidInput("validUrl");
          setFile(null);
          setTimeout(() => {
            setIsValidInput("");
          }, 3000);
        } else {
          console.error("Fail!");
        }
      } catch (error) {
        console.error(error);
        console.error("Fail!");
        setIsValidInput("notResponding");
        setFile(null);
        setTimeout(() => {
          setIsValidInput("");
        }, 3000);
      }
  };
  return (
    <React.Fragment>
      <Dialog
        open={chooseDocument}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "black",
          }}
        >
          Choose document to embedding
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "black",
            }}
          >
            Current in use:{" "}
            <span style={{ fontWeight: "bold", color: "#008000" }}>
              {currentDocument}
            </span>
          </DialogContentText>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={age}
              onChange={handleChange}
              sx={{
                width: 300,
              }}
            >
              {listDocument.map((item: ListCollection) => {
                return <MenuItem value={item.collection}>{item.collection}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleEmbedding}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ChooseDocument;
