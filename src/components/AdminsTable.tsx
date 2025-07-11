import { Cancel, CheckCircle, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useDbContent } from '../contexts/DBContentContext';
import { DBAdminUserWithAuthMeta } from '../interfaces/dbInterfaces';
import { removeAdmin } from '../helpers/removeAdmin';

interface Props {
   admins: DBAdminUserWithAuthMeta[];
   loading: boolean;
   refetch: () => void;
}

const AdminsTable: React.FC<Props> = ({ admins, loading, refetch }) => {
   const { websiteID } = useDbContent();

   const columns: GridColDef[] = [
      {
         field: 'active',
         headerName: 'Active',
         width: 100,
         renderCell: (params: GridRenderCellParams) =>
            params.value ? <CheckCircle color="success" /> : <Cancel color="error" />,
      },
      {
         field: 'remove',
         headerName: 'Remove',
         width: 80,
         renderCell: (params: GridRenderCellParams) => (
            <Tooltip title="Remove Admin">
               <IconButton
                  size="small"
                  onClick={(e) => {
                     e.stopPropagation();
                     const id = params.row.id;
                     if (websiteID && id) {
                        removeAdmin(websiteID, id).then(() => refetch());
                     }
                  }}
               >
                  <DeleteIcon color="error" />
               </IconButton>
            </Tooltip>
         ),
      },
      { field: 'email', headerName: 'Email', flex: 1 },
      { field: 'invitedByEmail', headerName: 'Invited By', flex: 1 },
      { field: 'invitedAt', headerName: 'Invited At', flex: 1 },
      { field: 'lastLogin', headerName: 'Last Login', flex: 1 },
      { field: 'role', headerName: 'Role', width: 150 },
   ];

   if (loading) return <Typography>Loading admins...</Typography>;
   if (admins.length === 0) return <Typography>No admins found.</Typography>;

   return (
      <DataGrid
         rows={admins}
         columns={columns}
         pageSizeOptions={[5, 10, 25]}
         paginationModel={{ pageSize: 10, page: 0 }}
         sortingOrder={['asc', 'desc']}
         autoHeight
      />
   );
};

export default AdminsTable;
