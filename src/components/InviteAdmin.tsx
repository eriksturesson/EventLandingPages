import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useDbContent } from '../contexts/DBContentContext';
import { inviteAdminURL } from '../utils/firebase';

const InviteAdmin: React.FC = () => {
   const [email, setEmail] = useState('');
   const { role } = useAuth();
   const [inviteeRole, setInviteeRole] = useState<UserRole>(role ? role : 'content creator');
   const [inviterRole, setInviterRole] = useState<UserRole>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [inviteURL, setInviteURL] = useState<string | null>(null);
   const { user } = useAuth();
   const { websiteID } = useDbContent();
   useEffect(() => {
      if (role) {
         setInviterRole(role);
      }
   }, [role]);
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
         const res = await response.json();

         if (!response.ok) {
            if (response.status === 409 && res.data.inviteID) {
               setError(
                  `En giltig inbjudan finns redan och är aktiv till ${new Date(res.data.invitedAt).toLocaleString()}.`
               );
               setInviteURL(`${window.location.host}/create-admin?id=${res.data.inviteID}&email=${res.data.email}`);
               setLoading(false);
               return;
            } else {
               throw new Error(res.data.message || 'Failed to send invite');
            }
         }

         const { inviteID } = res.data;
         if (!inviteID) {
            throw new Error('Invite ID not returned from server');
         }
         const inviteUrl = `${window.location.host}/create-admin?id=${inviteID}`;

         setEmail('');
         setInviteeRole('content creator');
         setInviteURL(inviteUrl);
      } catch (err: any) {
         console.error('Error in handleSubmit:', err);
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
      <Box sx={{ mt: 3, mb: 3, display: 'flex', flexDirection: 'column', gap: 2, mx: 'auto', maxWidth: 400 }}>
         <Typography variant="h4">Invite New Admin</Typography>
         <Typography variant="body1">You are authorized to invited other admins since you are {role}</Typography>

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
