import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, Typography, Button, Link } from "@mui/material";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { useFormik } from "formik";
import { Redirect } from "react-router-dom";
import * as yup from "yup";

import Header from "common/components/Header";
import TextInput from "common/components/TextInput";
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

  return !!user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <>
      <Header>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography fontSize={18}>Already have an account?</Typography>
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 40,
              marginLeft: 3,
              paddingX: 3,
              paddingY: 0.5,
              fontSize: 18,
              fontWeight: "regular",
              color: "white",
              backgroundColor: "green.main",
              textTransform: "none",
            }}
          >
            Log In
          </Button>
        </Box>
      </Header>
      <Container maxWidth="xs" sx={{ paddingY: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: "black.main" }}
          >
            Get started with PeerPrep
          </Typography>
          <Typography fontSize={20}>
            Prepare for technical questions with peers
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextInput
                  required
                  fullWidth
                  label="Name"
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
              <Grid item xs={12}>
                <TextInput
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  name="password1"
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password1 && Boolean(formik.errors.password1)
                  }
                  helperText={
                    formik.touched.password1 && formik.errors.password1
                  }
                  disabled={formik.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
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
                  helperText={
                    formik.touched.password2 && formik.errors.password2
                  }
                  disabled={formik.isSubmitting}
                />
              </Grid>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "yellow.main",
                color: "black.main",
                textTransform: "none",
                borderRadius: 30,
                fontSize: 18,
              }}
              loading={formik.isSubmitting}
            >
              Sign Up
            </LoadingButton>
          </Box>
          <Typography fontSize={14}>
            By clicking the button above, you agree to our{" "}
            <Link href="#">Terms and Conditions</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
