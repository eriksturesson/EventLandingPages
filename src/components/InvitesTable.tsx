import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { InvitedAdmin } from '../interfaces/dbInterfaces';
import { useDbContent } from '../contexts/DBContentContext';
import { removeInvite } from '../helpers/removeInvite';

interface Props {
   invites: InvitedAdmin[];
   loading: boolean;
   onRefresh: () => void; // Function to re-fetch invites after deletion
}

const InvitesTable: React.FC<Props> = ({ invites, loading, onRefresh }) => {
   const { websiteID } = useDbContent();

   const columns: GridColDef[] = [
      {
         field: 'remove',
         headerName: 'Remove',
         width: 80,
         sortable: false,
         renderCell: (params: GridRenderCellParams) => {
            const inviteID = params.row.inviteID;
            return (
               <Tooltip title="Remove Invite">
                  <IconButton
                     size="small"
                     onClick={(e) => {
                        e.stopPropagation();
                        if (websiteID && inviteID) {
                           removeInvite(websiteID, inviteID).then(onRefresh);
                        }
                     }}
                  >
                     <DeleteIcon color="error" />
                  </IconButton>
               </Tooltip>
            );
         },
      },
      { field: 'email', headerName: 'Email', flex: 1 },
      { field: 'role', headerName: 'Role', width: 160 },
      { field: 'invitedBy', headerName: 'Invited By', flex: 1 },
      {
         field: 'invitedAt',
         headerName: 'Invited At',
         flex: 1,
         renderCell: (params: GridRenderCellParams) => {
            const date = new Date(params.value as string);
            return <span>{date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>;
         },
      },
      {
         field: 'expiresIn',
         headerName: 'Expires In',
         width: 150,
         renderCell: (params: GridRenderCellParams) => {
            const invitedAt = new Date(params.row.invitedAt);
            const now = new Date();
            const diffInMs = invitedAt.getTime() + 1000 * 60 * 60 * 48 - now.getTime(); // 48h invite
            const hoursLeft = Math.floor(diffInMs / (1000 * 60 * 60));
            if (hoursLeft <= 0) return <span style={{ color: 'red' }}>Expired</span>;
            return <span>{hoursLeft}h left</span>;
         },
      },
      {
         field: 'invitationLink',
         headerName: 'Invitation Link',
         flex: 1.5,
         sortable: false,
         renderCell: (params: GridRenderCellParams) => {
            const link = `${window.location.host}/create-admin?id=${params.row.inviteID}&email=${encodeURIComponent(
               params.row.email
            )}`;
            return (
               <a
                  href={import.meta.env.VITE_NODE_ENV === 'production' ? `https://${link}` : `http://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  {link}
               </a>
            );
         },
      },
   ];

   if (loading) return <Typography>Loading invites...</Typography>;
   if (invites.length === 0) return <Typography>No pending invites found.</Typography>;

   return (
      <DataGrid
         rows={invites.map((invite) => ({ ...invite, id: invite.inviteID }))}
         columns={columns}
         pageSizeOptions={[5, 10, 25]}
         paginationModel={{ pageSize: 10, page: 0 }}
         sortingOrder={['asc', 'desc']}
         autoHeight
      />
   );
};

export default InvitesTable;
