import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { Redirect } from "react-router-dom";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import { mapUserData } from "features/auth/map-user-data.util";
import { selectUser, setUserData } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { open } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const userData = await mapUserData(userCredential.user);
        dispatch(setUserData(userData));

        open({
          message: "Login successful!",
        });
      } catch {
        setFieldError("email", "Invalid email or password. Please try again.");
        setFieldError(
          "password",
          "Invalid email or password. Please try again."
        );
      }
    },
  });

  return !!user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <Container maxWidth="xs">
      <Box
        sx={{
          paddingTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Login to PeerPrep
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter your email"
                autoComplete="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={formik.isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter your password"
                type="password"
                autoComplete="new-password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                disabled={formik.isSubmitting}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
            loading={formik.isSubmitting}
          >
            Log In
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
