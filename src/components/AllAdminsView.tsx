import { Cancel, CheckCircle } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDbContent } from '../contexts/DBContentContext';
import { DBAdminUserWithAuthMeta } from '../interfaces/dbInterfaces';
import { getAdminsURL } from '../utils/firebase';
import InviteAdmin from './InviteAdmin';

type Admin = {
   id: string;
   email: string;
   invitedBy: string;
   active: boolean;
   invitedAt: string; // ISO string
   lastLogin: string; // ISO string
   role: 'admin' | 'content creator';
};

const AllAdminsView: React.FC = () => {
   const [open, setOpen] = useState(false);
   const { user, role } = useAuth();
   const { websiteID } = useDbContent(); // Assuming websiteID is available in Auth context
   const [admins, setAdmins] = useState<DBAdminUserWithAuthMeta[]>([]);
   const [loading, setLoading] = useState(false);
   const fetchAdmins = async () => {
      setLoading(true);
      try {
         const idToken = user ? await user.getIdToken() : null;
         if (!idToken) {
            console.error('User is not authenticated');
            setLoading(false);
            return;
         }
         const response = await fetch(getAdminsURL, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${idToken}`,
               'x-website-id': websiteID,
            },
         });

         if (!response.ok) {
            throw new Error(`Failed to fetch admins: ${response.statusText}`);
         }

         const fetchedAdmins: DBAdminUserWithAuthMeta[] = await response.json();

         // Sätt admins till state
         setAdmins(fetchedAdmins);
         // Hitta nuvarande användare i listan
      } catch (error) {
         console.error('Failed to fetch admins:', error);
         setAdmins([]);
      } finally {
         setLoading(false);
      }
   };

   // Fetch admins when modal opens
   useEffect(() => {
      if (open) {
         fetchAdmins();
      }
   }, [open]);

   const columns: GridColDef[] = [
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
      { field: 'invitedBy', headerName: 'Invited By', flex: 1, minWidth: 180 },
      {
         field: 'active',
         headerName: 'Active',
         width: 100,
         sortable: true,
         renderCell: (params: GridRenderCellParams) =>
            params.value ? (
               <Tooltip title="Active">
                  <CheckCircle color="success" />
               </Tooltip>
            ) : (
               <Tooltip title="Inactive">
                  <Cancel color="error" />
               </Tooltip>
            ),
      },
      {
         field: 'invitedAt',
         headerName: 'Invited At',
         flex: 1,
         minWidth: 150,
         // Sorting works naturally on ISO date strings
      },
      {
         field: 'lastLogin',
         headerName: 'Last Login',
         flex: 1,
         minWidth: 150,
      },
      {
         field: 'role',
         headerName: 'Role',
         width: 150,
         sortable: true,
      },
   ];

   return (
      <>
         <Button variant="outlined" onClick={() => setOpen(true)}>
            Show All Admins
         </Button>

         <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
            {(role === 'admin' || role === 'superuser') && <InviteAdmin />}

            <DialogTitle>All Admins</DialogTitle>
            <DialogContent style={{ height: 500, width: '100%', overflowY: 'auto' }}>
               {loading ? (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                     Loading admins...
                  </Typography>
               ) : admins.length === 0 ? (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                     No admins found.
                  </Typography>
               ) : (
                  <DataGrid
                     rows={admins}
                     columns={columns}
                     pageSizeOptions={[5, 10, 25]}
                     paginationModel={{ pageSize: 10, page: 0 }}
                     sortingOrder={['asc', 'desc']}
                  />
               )}
            </DialogContent>
         </Dialog>
      </>
   );
};

export default AllAdminsView;
