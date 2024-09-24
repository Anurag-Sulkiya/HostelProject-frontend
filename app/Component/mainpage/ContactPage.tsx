"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper, 
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@mui/material';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  city: string;
  locality: string;
  message: string;
  agreeTerms: boolean;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
    city: '',
    locality: '',
    message: '',
    agreeTerms: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
    // Handle form submission logic here
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#f7f7f7',
      py: 2,
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 800,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <Grid container>
          {/* Left side with image */}
          <Grid item xs={12} sm={5} sx={{
            backgroundImage: 'url("/images/spacious.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            minHeight: { xs: 200, sm: 'auto' },
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              p: 2,
            }}>
              <Typography variant="h5" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">
                We're here to help with any questions you may have.
              </Typography>
            </Box>
          </Grid>

          {/* Right side with contact form */}
          <Grid item xs={12} sm={7} sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    size="small"
                    id="phoneCountryCode"
                    name="phoneCountryCode"
                    label="Code"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    select
                    required
                  >
                    <MenuItem value="+1">+1 (US)</MenuItem>
                    <MenuItem value="+44">+44 (UK)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    size="small"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="city"
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="locality"
                    name="locality"
                    label="Locality"
                    value={formData.locality}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        name="agreeTerms"
                        color="primary"
                        required
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">I agree to the terms and conditions</Typography>}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ContactPage;