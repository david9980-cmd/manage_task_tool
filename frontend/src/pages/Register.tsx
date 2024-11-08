import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigation
import { registerUser } from '../features/authSlice';
import { AppDispatch } from '../features/store';
import { registerValidationSchema } from '../utils/validationSchemas'; // Assuming you have a validation schema

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const initialValues = { email: '', password: '', confirmPassword: '' };

    const handleSubmit = async (values: { email: string; password: string; confirmPassword: string }) => {
        try {
            await dispatch(registerUser(values)).unwrap();
            // After successful registration, navigate to login page
            navigate('/login');
        } catch (error) {
            console.log('Registration failed', error);
        }
    };

    // Navigate to the login page
    const handleLoginRedirect = () => {
        navigate('/login');
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
                    Register
                </Typography>

                <Formik
                    initialValues={initialValues}
                    validationSchema={registerValidationSchema} // Validation schema for registration
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

                                <Field name="confirmPassword">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            type="password"
                                            label="Confirm Password"
                                            variant="outlined"
                                            fullWidth
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.confirmPassword}
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
                                    {isSubmitting ? 'Registering...' : 'Register'}
                                </Button>

                                {/* Login Button */}
                                <Button
                                    variant="text"
                                    color="secondary"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    onClick={handleLoginRedirect} // Navigate to Login page
                                >
                                    Already have an account? Login
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default Register;
