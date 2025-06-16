import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDbContent } from '../contexts/DBContentContext';
import { DBAdminUser } from '../interfaces/dbInterfaces';
import { inviteAdminURL } from '../utils/firebase';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';

type InviterRole = 'superuser' | 'admin' | 'content creator' | null;

const InviteAdmin: React.FC = () => {
   const [email, setEmail] = useState('');
   const [inviteeRole, setInviteeRole] = useState<'admin' | 'content creator'>('content creator');
   const [inviterRole, setInviterRole] = useState<InviterRole>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [inviteURL, setInviteURL] = useState<string | null>(null);

   const { user } = useAuth();
   const { websiteID } = useDbContent();

   // Fetch inviterRole from backend on mount or when user changes
   useEffect(() => {
      if (!user) {
         setInviterRole(null);
         return;
      }
      const fetchRole = async () => {
         try {
            const idToken = await user.getIdToken();
            // Your backend endpoint to get role of logged in user for a specific website
            const data: DBAdminUser = await readAndWriteToFirebase({
               method: 'get',
               ref: `admins/${websiteID}/${user.uid}/role`, // Adjust this path as needed)
            });

            if (!data || !data.role) {
               throw new Error('Failed to fetch inviter role');
            }
            // Assuming backend returns { role: 'admin' | 'superuser' | 'content creator' }
            setInviterRole(data.role);
         } catch (err) {
            console.error('Failed to fetch inviter role', err);
            setInviterRole(null);
         }
      };
      fetchRole();
   }, [user]);

   const handleSubmit = async () => {
      setLoading(true);
      setError(null);
      setInviteURL(null);

      if (!email) {
         setError('Email is required');
         setLoading(false);
         return;
      }
      if (!user) {
         setError('User not authenticated');
         setLoading(false);
         return;
      }
      if (!inviterRole || (inviterRole !== 'superuser' && inviterRole !== 'admin')) {
         setError('You do not have permission to invite admins');
         setLoading(false);
         return;
      }

      try {
         const idToken = await user.getIdToken();
         const response = await fetch(inviteAdminURL, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ email, role: inviteeRole, websiteID }),
         });

         if (!response.ok) {
            const data = await response.json();
            if (response.status === 409 && data.inviteID) {
               setError(`En giltig inbjudan finns redan och är aktiv till ${new Date(data.invitedAt).toLocaleString()}.`);
               setInviteURL(`${window.location.host}/create-admin?id=${data.inviteID}`);
            } else {
               throw new Error(data.message || 'Failed to send invite');
            }
            const errText = await response.text();
            throw new Error(errText || 'Failed to send invite');
         }

         const { inviteID } = await response.json();
         if (!inviteID) {
            throw new Error('Invite ID not returned from server');
         }
         const inviteUrl = `${window.location.host}/create-admin?id=${inviteID}`;

         setEmail('');
         setInviteeRole('content creator');
         setInviteURL(inviteUrl);
      } catch (err: any) {
         setError(err.message || 'Unknown error');
      }
      setLoading(false);
   };

   // Allowed roles to invite based on inviterRole
   const allowedInviteeRoles = inviterRole === 'superuser' || inviterRole === 'admin' ? ['admin', 'content creator'] : [];

   if (!inviterRole) {
      return <Typography>Loading user role...</Typography>;
   }
   if (allowedInviteeRoles.length === 0) {
      return <Typography color="error">You do not have permission to invite admins.</Typography>;
   }

   return (
      <Box sx={{ mt: 3, mb: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
         <Typography variant="h6">Invite New Admin</Typography>

         <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            fullWidth
            type="email"
         />

         <TextField
            select
            label="Role"
            value={inviteeRole}
            onChange={(e) => setInviteeRole(e.target.value as 'admin' | 'content creator')}
            disabled={loading}
            fullWidth
         >
            {allowedInviteeRoles.map((r) => (
               <MenuItem key={r} value={r}>
                  {r === 'admin' ? 'Admin' : 'Content Creator'}
               </MenuItem>
            ))}
         </TextField>

         <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Inviting...' : 'Invite Admin'}
         </Button>

         {error && <Typography color="error">{error}</Typography>}
         {inviteURL && (
            <>
               <Typography variant="subtitle1">Invitation sent! Share this link with the new admin:</Typography>
               <Typography color="success.main">{inviteURL}</Typography>
            </>
         )}
      </Box>
   );
};

export default InviteAdmin;
