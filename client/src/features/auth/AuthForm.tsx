import React from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { authSchema } from './authValidation';

interface AuthFormProps {
  title: string;
  onSubmit: (values: any) => void;
  buttonText: string;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, buttonText, error }) => {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: authSchema,
    onSubmit: (values) => onSubmit(values),
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {title}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 3, mb: 2 }}
            >
              {buttonText}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm;
