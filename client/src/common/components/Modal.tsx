import { Modal as MuiModal, Box } from "@mui/material";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  outlineColor: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  handleClose,
  outlineColor,
  children,
}: ModalProps) {
  return (
    <MuiModal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          border: "2px solid",
          borderColor: `${outlineColor}.main`,
          outline: 0,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </MuiModal>
  );
}
