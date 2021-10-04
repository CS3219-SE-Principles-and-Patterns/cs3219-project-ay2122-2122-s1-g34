import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { useFormik } from "formik";
import { Redirect } from "react-router-dom";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import { auth } from "common/utils/firebase.util";

import { mapUserData } from "features/auth/map-user-data.util";
import { selectUser, setUserData } from "features/auth/user.slice";
import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const validationSchema = yup.object({
  displayName: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password1: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1"), null], "Passwords must match"),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { open } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      password1: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await axios.post("/users", {
          displayName: values.displayName,
          email: values.email,
          password: values.password1,
        } as any);

        const customToken = response.data.token;
        const userCredential = await signInWithCustomToken(auth, customToken);

        const userData = await mapUserData(userCredential.user);
        dispatch(setUserData(userData));

        open({
          message:
            "Account created! You are now signed in to your new account!",
        });
      } catch (e: any) {
        if (e?.response?.data?.message) {
          Object.entries(e.response.data.message).forEach(
            ([property, value]) => {
              setFieldError(property, value as string);
            }
          );
        } else {
        }
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
          Get started with PeerPrep
        </Typography>
        <Typography>Prepare for technical questions with peers</Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter your name"
                autoFocus
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
              />
            </Grid>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter your password"
                type="password"
                autoComplete="new-password"
                name="password1"
                value={formik.values.password1}
                onChange={formik.handleChange}
                error={
                  formik.touched.password1 && Boolean(formik.errors.password1)
                }
                helperText={formik.touched.password1 && formik.errors.password1}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm password"
                type="password"
                name="password2"
                value={formik.values.password2}
                onChange={formik.handleChange}
                error={
                  formik.touched.password2 && Boolean(formik.errors.password2)
                }
                helperText={formik.touched.password2 && formik.errors.password2}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="warning"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
