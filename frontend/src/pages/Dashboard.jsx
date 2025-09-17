import React from 'react';
import { Grid, Container, Typography } from '@mui/material';

// Import components
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import ReviewsCard from '../components/dashboard/ReviewsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopSellers from '../components/dashboard/TopSellers';

// Import icons
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 5, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Daily Visitors" value="1,352" change="+2.5" changeType="positive" icon={<PeopleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Average Daily Sales" value="$51,352" change="+12.5" changeType="positive" icon={<BarChartIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Order This Month" value="1,352" change="-2.2" changeType="negative" icon={<ShoppingCartIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Monthly Earnings" value="$20,360" change="-2.2" changeType="negative" icon={<AttachMoneyIcon />} />
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <SalesChart />
        </Grid>

        {/* Reviews Card */}
        <Grid item xs={12} lg={4}>
          <ReviewsCard />
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <RecentOrders />
        </Grid>

        {/* Top Sellers */}
        <Grid item xs={12} lg={4}>
          <TopSellers />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
