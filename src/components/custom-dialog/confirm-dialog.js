import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export default function ConfirmDialog({ title, content, action, open, onClose, disabledCancel = false, disableBackdropClick = false, ...other }) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open}
      onClose={(event, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
          return;
        }

        onClose?.(event, reason);
      }}
      {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose} disabled={disabledCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  disabledCancel: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  title: PropTypes.string,
};
