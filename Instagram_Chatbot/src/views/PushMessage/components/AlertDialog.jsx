import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  openDialog,
  handleClose,
  message,
  resolver,
  itemDelete,
}) {
  const handleAccept = () => {
    resolver(itemDelete.id);
  };
  return (
    <div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color: '#333'}}>いいえ</Button>
          <Button
            className='px-2'
            style={{ backgroundColor: 'rgb(243 57 57)', color: '#fff' }}
            onClick={handleAccept}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
