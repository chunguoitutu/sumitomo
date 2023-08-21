import * as React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  TextField,
  FormControlLabel,
  Button,
  Checkbox,
} from "@mui/material";
import { request } from "~/ultis/helper/request";
import { userRole } from "~/server/app/models/UserModel";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  firstname: Yup.string().required("Required"),
  lastname: Yup.string().required("Required"),
});

const Register = ({ handleClose, infos }: any) => {
  const [errorMessage, setErrorMessage] = React.useState("");

  return (
    <Box className={"px-4"}>
      <Formik
        initialValues={{
          email: infos ? infos.email : "",
          password: infos ? infos.password : "",
          firstname: infos ? infos.firstname : "",
          lastname: infos ? infos.lastname : "",
          isActive: infos?.active ?? true,
          isAdmin: infos?.roles?.includes("admin") ? true : false,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setErrorMessage("");
          setSubmitting(false);

          // !infos means Register User, otherwise Edit User
          if (!infos) {
            request("/user/register", {
              method: "post",
              body: JSON.stringify(values),
            })
              .then((res) => res.json())
              .then((res) => {
                if (!res.error) {
                  window.location.reload();
                  handleClose();
                } else {
                  setErrorMessage(res.message);
                }
              });
          }

          request(`/user/${infos._id}`, {
            method: "put",
            body: JSON.stringify(values),
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.error) {
                window.location.reload();
                handleClose();
              } else {
                setErrorMessage(res.message);
              }
            });
        }}
        validationSchema={RegisterSchema}
      >
        {({
          values,
          handleSubmit,
          handleChange,
          isSubmitting,
          errors,
          touched,
          setFieldValue,
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
              id="firstname"
              label="First name"
              name="firstname"
              autoComplete="firstname"
              autoFocus
              defaultValue={values.firstname}
              onChange={handleChange}
              error={!!errors.firstname && !!touched.firstname}
              helperText={
                touched.firstname ? <>{errors.firstname}</> : undefined
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last name"
              name="lastname"
              autoComplete="lastname"
              defaultValue={values.lastname}
              onChange={handleChange}
              error={!!errors.lastname && !!touched.lastname}
              helperText={touched.lastname ? <>{errors.lastname}</> : undefined}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              defaultValue={values.email}
              onChange={handleChange}
              error={!!errors.email && !!touched.email}
              helperText={touched.email ? <>{errors.email}</> : undefined}
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
              error={!!errors.password && !!touched.password}
              helperText={touched.password ? <>{errors.password}</> : undefined}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  onChange={(e) => setFieldValue("isAdmin", e.target.checked)}
                  defaultChecked={
                    infos ? infos?.roles?.includes("admin") : false
                  }
                  disabled={
                    infos
                      ? !(infos?.roles[0] == "superAdmin")
                      : infos?.roles[0] == "superAdmin"
                  }
                />
              }
              label="Admin"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  onChange={(e) => setFieldValue("isActive", e.target.checked)}
                  defaultChecked={infos?.active ?? true}
                  disabled={
                    infos
                      ? !(infos?.roles[0] == "superAdmin")
                      : infos?.roles[0] == "superAdmin"
                  }
                />
              }
              label="Active"
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
                !values.password ||
                !!errors.firstname ||
                !values.firstname ||
                !!errors.lastname ||
                !values.lastname
              }
            >
              Submit
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
