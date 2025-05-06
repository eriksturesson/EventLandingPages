import { Box, Button, FormControl, FormHelperText, Grid, Input, InputLabel, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from './utils/firebase';

async function loginFunction({ email, password }: { email?: string; password?: string }) {
   if (!email || !password) {
      throw new Error('Email and password are required for login.');
   }
   try {
      let data = await signInWithEmailAndPassword(auth, email, password);
      return data.user.uid;
   } catch (error: any) {
      let errorMessage = error.message;
      errorMessage = errorMessage.replace('Firebase: ', '').replace('(', '').replace(')', '');
      throw new Error(errorMessage);
   }
}

export const Login = (): JSX.Element => {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setError(null);
         await loginFunction({ email, password });
      } catch (err: any) {
         setError(err.message);
      }
   };

   return (
      <Box
         sx={{
            margin: '1rem 1rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh', // Fill full screen
            // backgroundColor: '#f5f5f5', // Optional, for contrast
         }}
      >
         <Typography
            variant="h3"
            sx={{
               // fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
               color: 'black',
               mb: 2,
            }}
         >
            Logga in
         </Typography>
         <Box
            sx={{
               textAlign: 'left',
               mt: 2,
               mb: 2,
               backgroundColor: 'white',
               maxWidth: '400px',
               padding: '1rem',
               border: '1px solid black',
               borderRadius: '12px',
            }}
         >
            <Typography
               variant="caption"
               sx={{
                  // fontSize: { xs: '1rem', sm: '2rem', md: '3rem' },
                  color: 'black',
                  textAlign: 'center',
                  mt: 3,
                  mb: 3,
                  padding: '1rem',
               }}
            >
               Endast för admin till webbsidan
            </Typography>

            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}></Grid>
            </Grid>
            <form onSubmit={handleSubmit}>
               <Box>
                  <Box sx={{ mb: 2, mt: 4 }}>
                     <FormControl>
                        <InputLabel htmlFor="email-input">Email address</InputLabel>
                        <Input
                           id="email-input"
                           aria-describedby="email-helper-text"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           type="email"
                        />
                        <FormHelperText id="email-helper-text">Write your admin email</FormHelperText>
                     </FormControl>
                  </Box>

                  <Box sx={{ mb: 2, mt: 4 }}>
                     <FormControl>
                        <InputLabel htmlFor="password-input">Password</InputLabel>
                        <Input
                           id="password-input"
                           aria-describedby="password-helper-text"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           type="password"
                        />
                        <FormHelperText id="password-helper-text">Insert your password</FormHelperText>
                     </FormControl>
                  </Box>

                  {error && (
                     <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                     </Typography>
                  )}
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button type="submit" variant="contained" color="primary">
                     Sign in
                  </Button>
               </Box>
            </form>
         </Box>
         <Typography variant="caption" sx={{ mt: 2 }}>
            Har du frågor eller vill ha adminbehörighet? Kontakta Erik
         </Typography>
      </Box>
   );
};
