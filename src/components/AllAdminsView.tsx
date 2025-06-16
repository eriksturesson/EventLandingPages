import { Cancel, CheckCircle } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
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
   const { user } = useAuth();
   const [userRole, setUserRole] = useState<'admin' | 'content creator'>('content creator'); // Replace with actual user role logic
   const [admins, setAdmins] = useState<Admin[]>([]);
   const [loading, setLoading] = useState(false);

   const fetchAdmins = async () => {
      setLoading(true);
      try {
         const result = await readAndWriteToFirebase({ method: 'get', ref: 'admins' });
         // Always try to determine current user's role
         const currentUserData = result?.[user?.uid ?? ''];
         if (currentUserData?.role === 'admin' || currentUserData?.role === 'content creator') {
            setUserRole(currentUserData.role);
         } else {
            console.warn('No role found for current user');
            setUserRole('content creator'); // Fallback
         }
         if (result) {
            const adminsArray: Admin[] = Object.entries(result).map(([id, adminData]) => ({
               id,
               ...(adminData as Omit<Admin, 'id'>),
            }));
            setAdmins(adminsArray);
         } else {
            setAdmins([]);
         }
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
            {userRole === 'admin' && <InviteAdmin />}

            <DialogTitle>All Admins</DialogTitle>
            <DialogContent style={{ height: 500, width: '100%' }}>
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
