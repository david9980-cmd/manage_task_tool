import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Use this hook for navigation
import { loginUser } from '../features/authSlice';
import { AppDispatch } from '../features/store';
import { loginValidationSchema } from '../utils/validationSchemas';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Use navigate from react-router-dom v6

  const initialValues = { email: '', password: '' };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const resultAction = await dispatch(loginUser(values)).unwrap();

      if (resultAction?.token) {
        navigate('/');
      }
    } catch (error) {
      console.log('Login failed', error)
    }
  };

  // Navigate to the register page
  const handleRegisterRedirect = () => {
    navigate('/register'); // Navigate to the Register page using useNavigate
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ px: 2 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, handleBlur, values }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={2} width="100%" maxWidth="400px">
                <Field name="email">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      type="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                  )}
                </Field>

                <Field name="password">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Password"
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  )}
                </Field>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                {/* Register Button */}
                <Button
                  variant="text"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handleRegisterRedirect} // Navigate to Register page
                >
                  Don't have an account? Register
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
