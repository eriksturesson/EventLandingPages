import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useDbContent } from '../contexts/DBContentContext';
import { getAdminsURL } from '../utils/firebase';
import { DBAdminUserWithAuthMeta, InvitedAdmin } from '../interfaces/dbInterfaces';
import AdminsTable from './AdminsTable';
import InviteAdmin from './InviteAdmin';
import InvitesTable from './InvitesTable';

const AllAdminsView: React.FC = () => {
   const [open, setOpen] = useState(false);
   const [admins, setAdmins] = useState<DBAdminUserWithAuthMeta[]>([]);
   const [invites, setInvites] = useState<InvitedAdmin[]>([]);
   const [loadingAdmins, setLoadingAdmins] = useState(false);
   const [loadingInvites, setLoadingInvites] = useState(false);

   const { user, role } = useAuth();
   const { websiteID } = useDbContent();

   const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
         const idToken = await user?.getIdToken();
         if (!idToken) return;

         const res = await fetch(getAdminsURL, {
            headers: {
               Authorization: `Bearer ${idToken}`,
               'x-website-id': websiteID,
            },
         });

         if (!res.ok) throw new Error('Failed to fetch admins');
         const data = await res.json();
         setAdmins(data.admins || []);
         setInvites(data.invites || []);
      } catch (e) {
         console.error(e);
         setAdmins([]);
         setInvites([]);
      } finally {
         setLoadingAdmins(false);
      }
   };

   useEffect(() => {
      if (open) fetchAdmins();
   }, [open]);

   return (
      <>
         <Button variant="outlined" onClick={() => setOpen(true)}>
            Show All Admins
         </Button>
         <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
            <DialogContent>
               {(role === 'admin' || role === 'superuser') && <InviteAdmin />}
               <Typography variant="h5" sx={{ mt: 2 }}>
                  Admins
               </Typography>
               <AdminsTable admins={admins} loading={loadingAdmins} refetch={fetchAdmins} />

               <Typography variant="h5" sx={{ mt: 4 }}>
                  Pending Invites
               </Typography>
               <InvitesTable invites={invites} loading={loadingAdmins} onRefresh={fetchAdmins} />
            </DialogContent>
         </Dialog>
      </>
   );
};
export default AllAdminsView;
