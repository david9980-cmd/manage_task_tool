import { createStyles, makeStyles } from '@mui/styles';

export const globalStyles = makeStyles((theme: any) =>
  createStyles({

    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      // necessary for content to be below app bar
      justifyContent: 'flex-end',
    },
    content: {
      
    },

  }),
);

 