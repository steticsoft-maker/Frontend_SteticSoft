import React from 'react';
import { Card, CardHeader, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

const sellers = [
  { name: 'Gago Paquette', revenue: '$350,000', itemsSold: '13,440', avatarInitial: 'GP' },
  { name: 'Lara Harvey', revenue: '$148,000', itemsSold: '10,240', avatarInitial: 'LH' },
  { name: 'Evan Scott', revenue: '$148,000', itemsSold: '10,240', avatarInitial: 'ES' },
];

const TopSellers = () => {
  return (
    <Card>
      <CardHeader title="Top Seller" />
      <List sx={{ pt: 0, '& .MuiListItem-root': { py: 1.5 } }}>
        {sellers.map((seller, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar>{seller.avatarInitial}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={seller.name}
              secondary={seller.revenue}
              primaryTypographyProps={{ fontWeight: 'medium', variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                {seller.itemsSold}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default TopSellers;
