import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ButtonModalProps {
  totalSelected: number;
  totalRequired: number;
}

export default function ButtonModal({ totalSelected, totalRequired }: ButtonModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (totalSelected < totalRequired) {
      alert(`Debes seleccionar ${totalRequired} asientos antes de continuar. Faltan ${totalRequired - totalSelected}.`);
      return;
    }
    setOpen(true);
  };  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button sx={{
    backgroundColor: '#96C3FF',
    boxShadow: '0px 1px 4px 0.5px rgba(0,75,173,1)',
    fontFamily: '"League Spartan", sans-serif',
    fontSize: '22px',
    color: '#004AAD',
    fontWeight: 'bold',
    width: '150px',
    height: '35px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '15px',
    '&:hover': {
      backgroundColor: '#85b2f5' // Color más oscuro para hover
    }
  }} onClick={handleOpen}>Finalizar</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            COMPRA SATISFACTORIA
          </Typography>
          </Box>
      </Modal>
    </div>
  );
}