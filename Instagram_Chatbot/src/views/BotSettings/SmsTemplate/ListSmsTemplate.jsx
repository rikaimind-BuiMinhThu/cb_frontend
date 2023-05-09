import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { tokenExpired } from "api/tokenExpired";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import api from "api/api-management";
import CreateSmsTemplateDialog from "./CreateSmsTemplateDialog";
import UpdateSmsTemplateDialog from "./UpdateSmsTemplateDialog";

const ListSmsTemplate = () => {
  const { botId } = useParams();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [openToast, setOpenToast] = React.useState(false);

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const handleCreateSuccess = () => {
    setPage(1);
  };

  const onChangePage = (_, page) => {
    setPage(page);
  };

  const onDelete = () => {
    api
      .delete(`/api/v1/managements/sms_templates/${deleteId}`, {
        params: { chatbot_id: botId },
      })
      .then((response) => {
        if (response.data.code === 1) {
          handleOpenToast();
          setList((pre) => pre.filter((each) => each.id !== deleteId));
          handleCloseDeleteDialog();
        }
      })
      .catch((err) => {
        if (err?.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const handleOpenDeleteDialog = (id) => () => {
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleOpenUpdateDialog = (id) => () => {
    setOpenUpdateDialog(true);
    setUpdateId(id);
  };

  const handleCloseUpdateDialog = (item) => {
    if (item) {
      setList((pre) => pre.map((each) => (each.id === updateId ? item : each)));
    }
    setOpenUpdateDialog(false);
    setUpdateId(null);
  };

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await api.get(`/api/v1/managements/sms_templates`, {
          params: { page, chatbot_id: botId },
        });
        if (response.data.code === 1) {
          setList(response.data.data.map((x, i) => ({ ...x, index: i + 1 })));
          setCount(response.data.total);
        }
      } catch (err) {
        if (err?.response?.data.code === 0) {
          tokenExpired();
        }
      }
    };

    getList();
  }, [page, botId]);

  return (
    <div className="content">
      <Card>
        <CardHeader
          title="SMS一覧"
          action={
            <CreateSmsTemplateDialog
              botId={botId}
              resolver={handleCreateSuccess}
            />
          }
        />
        <CardContent>
          <TableContainer
            component={Paper}
            sx={{
              marginBottom: "16px",
            }}
          >
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  {["No.", "テンプレート名", "メール内容", "アクション"].map(
                    (each, index) => (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#fafafa",
                        }}
                        key={index}
                      >
                        {each}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    hover
                  >
                    <TableCell size="small" component="th" scope="row">
                      {index + 1 + 10 * (page - 1)}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.content}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={2} justifyContent={"end"}>
                        <Button
                          variant="outlined"
                          onClick={handleOpenUpdateDialog(row.id)}
                        >
                          編集
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleOpenDeleteDialog(row.id)}
                        >
                          削除
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    データがありません。
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(count / 10)}
            variant="outlined"
            page={page}
            onChange={onChangePage}
          />
        </CardContent>
      </Card>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        scroll={"paper"}
      >
        <DialogTitle>確認</DialogTitle>
        <DialogContent dividers={"paper"}>本当に削除しますか。</DialogContent>
        <DialogActions>
          <Button
            sx={{ minWidth: "100px" }}
            variant="outlined"
            onClick={handleCloseDeleteDialog}
          >
            閉じる
          </Button>
          <Button
            sx={{ minWidth: "100px" }}
            variant="contained"
            color="error"
            onClick={onDelete}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleCloseToast}
      >
        <MuiAlert
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          正常に削除しました。
        </MuiAlert>
      </Snackbar>
      <UpdateSmsTemplateDialog
        botId={botId}
        resolver={handleCloseUpdateDialog}
        open={openUpdateDialog}
        id={updateId}
      />
    </div>
  );
};

export default ListSmsTemplate;
