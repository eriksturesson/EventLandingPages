import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDbContent } from '../contexts/DBContentContext';
import { createAdminURL } from '../utils/firebase';

const CreateAdmin = () => {
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);

   const id = searchParams.get('id');
   const emailFromUrl = searchParams.get('email');

   const [email, setEmail] = useState(emailFromUrl ?? '');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
   const { websiteID } = useDbContent();
   const auth = getAuth();

   const handleCreate = async () => {
      if (!email || !password) {
         setMessage({ type: 'error', text: 'Email and password are required' });
         return;
      }
      try {
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         setMessage({ type: 'success', text: `Admin created with UID: ${userCredential.user.uid}` });
         const idToken = await userCredential.user.getIdToken();
         const response = await fetch(createAdminURL, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ email, inviteID: id, userID: userCredential.user.uid, websiteID }),
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create admin');
         }
         setMessage({ type: 'success', text: 'created user' });
      } catch (error: any) {
         setMessage({ type: 'error', text: `Error creating user: ${error.message}` });
      }
   };

   if (!id || !emailFromUrl) {
      return (
         <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="error">
               Missing required parameters (id or email) in URL.
            </Typography>
         </Box>
      );
   }

   return (
      <Box
         sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 8,
            p: 3,
            border: '1px solid #ddd',
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: 'background.paper',
         }}
      >
         <Typography variant="h5" gutterBottom>
            Create Admin Account
         </Typography>

         <Typography variant="body2" gutterBottom>
            ID: <strong>{id}</strong>
         </Typography>

         <TextField label="Email" type="email" value={email} fullWidth disabled margin="normal" />

         <TextField
            label="Set Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
         />

         {message && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
               {message.text}
            </Alert>
         )}

         <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleCreate}>
            Create Admin
         </Button>
      </Box>
   );
};

export default CreateAdmin;
