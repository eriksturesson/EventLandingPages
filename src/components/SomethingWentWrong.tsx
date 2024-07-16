import { Box, List, ListItem, Typography } from '@mui/material';

export function SomethingWentWrong(): JSX.Element {
   return (
      <Box sx={{ textAlign: 'center' }}>
         <Typography variant="h1" component="h1">
            Something went wrong
         </Typography>
         <Typography variant="h2" component="h2">
            Try again later, or contact us. Here are some things you can try:
         </Typography>
         <List>
            <ListItem>Check your internet connection</ListItem>
         </List>
      </Box>
   );
}
