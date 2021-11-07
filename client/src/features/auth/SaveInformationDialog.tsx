import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { updateEmail, updateProfile } from "firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useFormik } from "formik";
import * as yup from "yup";

import TextInput from "common/components/TextInput";
import { useAppDispatch } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import { reload } from "features/auth/user.slice";
import { logout } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const PasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("You current password is required"),
});

interface SaveInformationDialogProps extends DialogProps {
  handleClose: () => void;
  email: string;
  displayName: string;
  setAccountFieldError: (field: string, message: string | undefined) => void;
}

export default function SaveInformationDialog({
  handleClose,
  email,
  displayName,
  setAccountFieldError,
  ...rest
}: SaveInformationDialogProps) {
  const dispatch = useAppDispatch();
  const { open } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const user = auth.currentUser;

        if (user && user.email) {
          // check if current password is correct
          const credential = EmailAuthProvider.credential(
            user.email,
            values.currentPassword
          );

          // re-authenticate user
          await reauthenticateWithCredential(user, credential);

          await updateEmail(user, email);
          await updateProfile(user, { displayName });
          await dispatch(reload());
          open({
            message: "Update successful!",
          });
          open({
            message: "Password successfully changed. Please login again.",
          });
          dispatch(logout());
        } else {
          console.error(
            "User is not logged in or does not have an email address"
          );
        }

        handleClose();
      } catch (e: any) {
        if (e.code === "auth/wrong-password") {
          setFieldError("currentPassword", "Current password is invalid!");
        } else if (
          e?.response?.data?.message &&
          typeof e?.response?.data?.message === "object"
        ) {
          Object.entries(e.response.data.message).forEach(
            ([property, value]) => {
              setAccountFieldError(property, value as string);
            }
          );
        } else {
          open({
            severity: "error",
            message: "An unspecified error has occurred. Please try again",
          });
        }
      }
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm your password before making any changes</DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextInput
            required
            fullWidth
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword)
            }
            helperText={
              formik.touched.currentPassword && formik.errors.currentPassword
            }
            disabled={formik.isSubmitting}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" autoFocus disabled={formik.isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
