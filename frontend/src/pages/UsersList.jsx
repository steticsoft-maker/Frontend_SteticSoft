import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  Chip,
  IconButton,
  Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const users = [
    { id: 1, avatar: 'AM', name: 'Amanda Montgomery', email: 'montgomery@ya.com', company: 'Meta', role: 'Subscriber' },
    { id: 2, avatar: 'CD', name: 'Chelsey Dietrich', email: 'lucio_hettinger@annie.ca', company: 'Keebler LLC', role: 'Subscriber' },
    { id: 3, avatar: 'CB', name: 'Clementine Bauch', email: 'athan@yesenia.net', company: 'Jacobson', role: 'Contributor' },
    { id: 4, avatar: 'CB', name: 'Clementine Bauch', email: 'athana@yesenia.net', company: 'Jacobson', role: 'Contributor' },
    { id: 5, avatar: 'CC', name: 'Clifford Caldwell', email: 'clifford-c@email.com', company: 'Disney', role: 'Contributor' },
];

const roleConfig = {
    Subscriber: { color: 'info', text: 'Subscriber' },
    Contributor: { color: 'warning', text: 'Contributor' },
    Editor: { color: 'success', text: 'Editor' },
    Administrator: {color: 'primary', text: 'Administrator'}
};


const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 250,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
        <Avatar sx={{ mr: 2 }}>{params.row.avatar}</Avatar>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{params.row.name}</Typography>
      </Box>
    ),
  },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  { field: 'company', headerName: 'Company', flex: 1, minWidth: 150 },
  {
    field: 'role',
    headerName: 'Role',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
        const role = roleConfig[params.value];
        return <Chip label={role.text} color={role.color || 'default'} size="small" />;
    }
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    align: 'right',
    sortable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    ),
  },
];

const UsersList = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Users
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Add New User
                </Button>
            </Box>

            <Card>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tab label="All Users" />
                    <Tab label="Editor" />
                    <Tab label="Contributor" />
                    <Tab label="Administrator" />
                    <Tab label="Subscriber" />
                </Tabs>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            ),
                        }}
                        sx={{width: '300px'}}
                    />
                </Box>

                <Box sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        getRowHeight={() => 'auto'}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f4f6f8' : '#333c4d',
                                color: 'text.secondary'
                            },
                             '&.MuiDataGrid-root': {
                                border: 'none',
                            },
                             '& .MuiDataGrid-cell': {
                                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                            },
                        }}
                    />
                </Box>
            </Card>
        </Container>
    );
};

export default UsersList;
