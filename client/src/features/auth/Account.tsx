import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

import TextInput from "common/components/TextInput";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";

import ChangePasswordDialog from "features/auth/ChangePasswordDialog";
import SignedInHeader from "features/auth/SignedInHeader";
import { selectUser } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const validationSchema = yup.object({
  displayName: yup.string().required("Display name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function Account() {
  const user = useAppSelector(selectUser);
  const { open } = useSnackbar();
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      displayName: user ? user.displayName : "",
      email: user ? user.email : "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        // TODO: Update user

        open({
          message: "Update successful!",
        });
      } catch (e: any) {
        if (
          e?.response?.data?.message &&
          typeof e?.response?.data?.message === "object"
        ) {
          Object.entries(e.response.data.message).forEach(
            ([property, value]) => {
              setFieldError(property, value as string);
            }
          );
        } else {
          open({
            message: "An unspecified error has occurred. Please try again.",
            severity: "error",
          });
        }
      }
    },
  });

  return (
    <>
      <SignedInHeader />
      <ChangePasswordDialog
        open={isChangingPassword}
        handleClose={() => {
          setIsChangingPassword(false);
        }}
      />
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          paddingY: 1,
        }}
      >
        <Typography variant="h5" fontWeight={"600"} gutterBottom>
          Account Details
        </Typography>

        <Box
          maxWidth="sm"
          sx={{ mt: 1, flexGrow: 1, alignItems: "flex-start", marginY: 4 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextInput
                required
                fullWidth
                label="Display Name"
                autoComplete="displayName"
                name="displayName"
                value={formik.values.displayName}
                onChange={formik.handleChange}
                error={
                  formik.touched.displayName &&
                  Boolean(formik.errors.displayName)
                }
                helperText={
                  formik.touched.displayName && formik.errors.displayName
                }
                disabled={formik.isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInput
                required
                fullWidth
                label="Email"
                autoComplete="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={formik.isSubmitting}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Button
              onClick={() => {
                setIsChangingPassword(true);
              }}
            >
              Change password
            </Button>
            <LoadingButton
              variant="contained"
              size="small"
              type="submit"
              sx={{
                borderRadius: 40,
                paddingX: 3,
                paddingY: 1,
                fontSize: 16,
                fontWeight: "regular",
                color: "lightGray.main",
                backgroundColor: "green.main",
                textTransform: "none",
              }}
              disabled={!formik.dirty}
              loading={formik.isSubmitting}
            >
              Save
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </>
  );
}
