"use client";

import { useState } from "react";
import * as Yup from "yup";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import Copyright from "~/components/Copyright";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import logo from "~/public/images/logo.png";
import Image from "next/image";
import { request } from "~/ultis/helper/request";
import { useAppDispatch } from "~/hooks/hooks";
import { MESSAGE_500 } from "~/ultis/constants/common";
import { setToken } from "~/ultis/slices/userSlice";
import { useRouter } from "next/navigation";
import { FormikHelpers, Formik } from "formik";

const theme = createTheme();

interface valuesForm {
  email: string;
  password: string;
}

const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignIn = () => {
  // const dispatch = useAppDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const { push } = useRouter();

  function handleSubmit(
    values: valuesForm,
    { setSubmitting }: FormikHelpers<valuesForm>
  ) {
    setErrorMessage("");
    request("/auth/login", {
      method: "post",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          return setErrorMessage(res.message || MESSAGE_500);
        }

        push("/");
      });

    setSubmitting(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        className={"relative h-[calc(100vh-64px)]"}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={logo}
            alt="logo"
            objectFit="cover"
            layout="fill"
            className="!static"
            priority
          />

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={SigninSchema}
          >
            {({
              values,
              handleSubmit,
              handleChange,
              isSubmitting,
              errors,
              touched,
            }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  defaultValue={values.email}
                  onChange={handleChange}
                  error={!!errors.email && touched.email}
                  helperText={touched.email ? errors.email : undefined}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  defaultValue={values.password}
                  onChange={handleChange}
                  error={!!errors.password && touched.password}
                  helperText={touched.password ? errors.password : undefined}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                {errorMessage && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {errorMessage}
                  </div>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={
                    isSubmitting ||
                    !!errors.email ||
                    !!errors.password ||
                    !values.email ||
                    !values.password
                  }
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
        <Copyright
          sx={{ mt: 8, mb: 4 }}
          className={"absolute bottom-4 left-1/2 translate-x-[-50%]"}
        />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
