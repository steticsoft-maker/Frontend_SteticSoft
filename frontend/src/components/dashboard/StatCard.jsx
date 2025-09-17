import React from 'react';
import { Card, CardContent, Typography, Avatar, Chip, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const StatCard = ({ title, value, change, changeType, icon }) => {
  const theme = useTheme();
  const isPositive = changeType === 'positive';

  const chipBgColor = isPositive ? alpha(theme.palette.success.main, 0.16) : alpha(theme.palette.error.main, 0.16);

  // Use light for dark mode text, and dark for light mode text
  const chipColor = theme.palette.mode === 'dark'
    ? (isPositive ? theme.palette.success.light : theme.palette.error.light)
    : (isPositive ? theme.palette.success.dark : theme.palette.error.dark);

  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Avatar sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            width: 56,
            height: 56,
            mr: 2
        }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          {change && (
            <Chip
              icon={isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
              label={`${change}%`}
              size="small"
              sx={{
                fontWeight: 'bold',
                bgcolor: chipBgColor,
                color: chipColor,
                // The icon color needs to be set explicitly
                '& .MuiChip-icon': {
                    color: chipColor,
                }
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
