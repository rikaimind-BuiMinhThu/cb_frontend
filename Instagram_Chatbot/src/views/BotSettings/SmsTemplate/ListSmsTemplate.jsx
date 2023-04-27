import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import api from "api/api-management";
import CreateSmsTemplateDialog from "./CreateSmsTemplateDialog";

const ListSmsTemplate = () => {
  const { botId } = useParams();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);

  const getListSMSTemplate = async () => {
    try {
      const res = await api.get(
        `/api/v1/managements/sms_templates?chatbot_id=${botId}`
      );
      debugger;
      // if (res.data.code === 1) {
      //   setListSMSTemplate(
      //     res.data.data.map((x, i) => ({ ...x, index: i + 1 }))
      //   );
      // }
    } catch (err) {
      // if (err?.response?.data.code === 0) {
      //   tokenExpired();
      // }
    }
  };

  useEffect(() => {
    getListSMSTemplate();
  }, []);

  return (
    <div className="content">
      <Card>
        <CardHeader title="SMS一覧" action={<CreateSmsTemplateDialog />}/>
        <CardContent>
          <TableContainer component={Paper} sx={{
            marginBottom: '16px'
          }}>
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell align="center">テンプレート名</TableCell>
                  <TableCell align="center">メール内容</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row) => (
                  <TableRow
                    key={row.no}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.no}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination count={10} variant="outlined" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ListSmsTemplate;
