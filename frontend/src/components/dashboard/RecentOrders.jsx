import React from 'react';
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, Box, Avatar, CardHeader } from '@mui/material';

const orders = [
  { id: '#E256', method: 'Paid by Paypal', avatarInitial: 'PP', created: '7 minutes ago', total: '$678.5', status: 'Pending' },
  { id: '#HBHub', method: 'Paid by Card', avatarInitial: 'MC', created: '8 minutes ago', total: '$185.58', status: 'Shipped' },
  { id: '#57Tav', method: 'Paid by Skrill', avatarInitial: 'SK', created: '9 minutes ago', total: '$463.25', status: 'Confirmed' },
];

const statusConfig = {
  Pending: { color: 'warning', text: 'Pending' },
  Shipped: { color: 'info', text: 'Shipped' },
  Confirmed: { color: 'success', text: 'Confirmed' },
};

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader title="Recent Orders" />
      <TableContainer>
        <Table aria-label="recent orders table">
          <TableHead>
            <TableRow>
              <TableCell>METHOD</TableCell>
              <TableCell>CREATED</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1.5, width: 32, height: 32, bgcolor: 'background.default', fontSize: '0.8rem' }}>
                      {order.avatarInitial}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{order.id}</Typography>
                      <Typography variant="body2" color="text.secondary">{order.method}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{order.created}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{order.total}</TableCell>
                <TableCell>
                  <Chip label={statusConfig[order.status].text} color={statusConfig[order.status].color} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RecentOrders;
