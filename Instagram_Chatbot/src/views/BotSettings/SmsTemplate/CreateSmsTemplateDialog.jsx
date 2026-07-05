import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "./schema/createSmsTemplateFormSchema";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import api from "api/api-management";
import { tokenExpired } from "api/tokenExpired";

export default function CreateSmsTemplateDialog({ botId, resolver }) {
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
    setErrorMessage('');
  };

  const descriptionElementRef = React.useRef(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const watchContent = watch("content");

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`/api/v1/managements/sms_templates`, {
        chatbot_id: botId,
        sms_template: {
          name: data.name,
          content: data.content,
        },
      });
      if (response?.data?.code === 2) {
        handleOpenToast();
        setErrorMessage(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        handleOpenToast();
        resolver(response?.data?.data)
        handleClose();
      }
    } catch (error) {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button
        sx={{ minWidth: "100px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        追加
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">SMS作成</DialogTitle>
        <DialogContent dividers={"paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Stack spacing={2} minWidth={{ xs: "200px", md: "500px" }}>
              <TextField
                required
                label="テンプレート名"
                error={errors?.name?.message}
                helperText={errors?.name?.message}
                {...register("name")}
              />
              <TextField
                required
                label="メッセージ"
                multiline
                rows={4}
                error={errors?.content?.message}
                helperText={errors?.content?.message}
                {...register("content")}
              />
              {watchContent?.length || 0} 文字
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ minWidth: "100px" }}
            variant="outlined"
            onClick={handleClose}
          >
            閉じる
          </Button>
          <Button
            sx={{ minWidth: "100px" }}
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleCloseToast}
      >
        {errorMessage ? (
          <MuiAlert
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {errorMessage}
          </MuiAlert>
        ) : (
          <MuiAlert
            severity="success"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            テンプレートが正常に作成されました。
          </MuiAlert>
        )}
      </Snackbar>
    </div>
  );
}
