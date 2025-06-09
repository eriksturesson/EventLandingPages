import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Grid,
   MenuItem,
   TextField,
   Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SiteSettingsData } from '../interfaces/SettingsInterfaces';

interface SiteSettingsProps {
   open: boolean;
   onClose: () => void;
   siteSettings: SiteSettingsData | null;
   onSave: (settings: SiteSettingsData) => void;
}
const defaultSettings: SiteSettingsData = {
   font: '',
   primaryColor: '#000000',
   textColor: '#000000',
   customCSS: '',
   customHTMLHead: '',
   customHTMLBodyEnd: '',
   logoUrl: '',
   faviconUrl: '',
};
const availableFonts = ['Open Sans', 'Roboto', 'Lato', 'Montserrat', 'Poppins', 'Arial', 'Verdana'];

const SiteSettings: React.FC<SiteSettingsProps> = ({ open, onClose, siteSettings, onSave }) => {
   const [settings, setSettings] = useState<SiteSettingsData>(siteSettings ?? defaultSettings);

   useEffect(() => {
      // Om initialSettings ändras (t.ex. ny data från föräldern) vill vi uppdatera state
      if (open) {
         if (siteSettings) setSettings(siteSettings);
      }
   }, [open, siteSettings]);

   const handleChange = (field: keyof SiteSettingsData, value: string) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
   };

   const handleSave = () => {
      onSave(settings);
      onClose();
   };

   return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
         <DialogTitle>Site Settings</DialogTitle>
         <DialogContent dividers>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Font"
                     select
                     fullWidth
                     value={settings.font}
                     onChange={(e) => handleChange('font', e.target.value)}
                  >
                     {availableFonts.map((font) => (
                        <MenuItem key={font} value={font}>
                           {font}
                        </MenuItem>
                     ))}
                  </TextField>
               </Grid>

               <Grid item xs={6} sm={3}>
                  <TextField
                     label="Primär färg"
                     type="color"
                     fullWidth
                     value={settings.primaryColor}
                     onChange={(e) => handleChange('primaryColor', e.target.value)}
                  />
               </Grid>

               <Grid item xs={6} sm={3}>
                  <TextField
                     label="Textfärg"
                     type="color"
                     fullWidth
                     value={settings.textColor}
                     onChange={(e) => handleChange('textColor', e.target.value)}
                  />
               </Grid>

               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Logo URL"
                     fullWidth
                     value={settings.logoUrl}
                     onChange={(e) => handleChange('logoUrl', e.target.value)}
                  />
               </Grid>

               <Grid item xs={12} sm={6}>
                  <TextField
                     label="Favicon URL"
                     fullWidth
                     value={settings.faviconUrl}
                     onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  />
               </Grid>

               <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                     Custom CSS
                  </Typography>
                  <TextField
                     multiline
                     fullWidth
                     minRows={6}
                     value={settings.customCSS}
                     onChange={(e) => handleChange('customCSS', e.target.value)}
                     placeholder={`h1 {\n  color: #f7a81b;\n  ...\n}`}
                  />
               </Grid>

               <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                     Custom HTML &lt;head&gt;
                  </Typography>
                  <TextField
                     multiline
                     fullWidth
                     minRows={4}
                     value={settings.customHTMLHead}
                     onChange={(e) => handleChange('customHTMLHead', e.target.value)}
                     placeholder={`<script src="..."></script>`}
                  />
               </Grid>

               <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                     Custom HTML före &lt;/body&gt;
                  </Typography>
                  <TextField
                     multiline
                     fullWidth
                     minRows={4}
                     value={settings.customHTMLBodyEnd}
                     onChange={(e) => handleChange('customHTMLBodyEnd', e.target.value)}
                     placeholder={`<script>GDPR.init()</script>`}
                  />
               </Grid>
            </Grid>
         </DialogContent>

         <DialogActions>
            <Button onClick={onClose}>Avbryt</Button>
            <Button variant="contained" onClick={handleSave}>
               Spara
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default SiteSettings;
