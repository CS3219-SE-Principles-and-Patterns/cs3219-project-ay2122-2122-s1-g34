import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useFormik } from "formik";
import * as yup from "yup";

import TextInput from "common/components/TextInput";
import { useAppDispatch } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import { logout } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const PasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("You current password is required"),
  password1: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1"), null], "Passwords must match"),
});

interface ChangePasswordDialogProps extends DialogProps {
  handleClose: () => void;
}

export default function ChangePasswordDialog({
  handleClose,
  ...rest
}: ChangePasswordDialogProps) {
  const dispatch = useAppDispatch();
  const { open } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password1: "",
      password2: "",
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
          await updatePassword(user, values.password1);

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
      <DialogTitle>Change Password</DialogTitle>
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
          <TextInput
            required
            fullWidth
            label="New Password"
            type="password"
            name="password1"
            value={formik.values.password1}
            onChange={formik.handleChange}
            error={formik.touched.password1 && Boolean(formik.errors.password1)}
            helperText={formik.touched.password1 && formik.errors.password1}
            disabled={formik.isSubmitting}
            margin="normal"
          />
          <TextInput
            required
            fullWidth
            label="Confirm New Password"
            type="password"
            name="password2"
            value={formik.values.password2}
            onChange={formik.handleChange}
            error={formik.touched.password2 && Boolean(formik.errors.password2)}
            helperText={formik.touched.password2 && formik.errors.password2}
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
