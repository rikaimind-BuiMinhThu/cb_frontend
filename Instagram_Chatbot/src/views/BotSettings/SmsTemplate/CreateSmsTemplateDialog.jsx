import * as React from "react";
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

export default function CreateSmsTemplateDialog() {
  const [open, setOpen] = React.useState(false);

  const descriptionElementRef = React.useRef(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const watchContent = watch("content");

  const onSubmit = (data) => {

  }
  React.useEffect(() => {
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
                error={errors?.templateName?.message}
                helperText={errors?.templateName?.message}
                {...register("templateName")}
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
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
