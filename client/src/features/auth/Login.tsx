import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
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
          <Typography fontSize={18}>Do not have an account?</Typography>
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
              color: "black.main",
              backgroundColor: "yellow.main",
              textTransform: "none",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Header>
      <Container maxWidth="xs" sx={{ paddingY: 8 }}>
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
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              color: "black.main",
            }}
          >
            Login to PeerPrep
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "green.main",
                color: "white",
                textTransform: "none",
                borderRadius: 30,
                fontSize: 20,
              }}
              loading={formik.isSubmitting}
            >
              Log In
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </>
  );
}
