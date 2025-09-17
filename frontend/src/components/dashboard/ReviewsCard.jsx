import React from 'react';
import { Card, CardContent, Typography, Box, Rating, LinearProgress, Grid, styled } from '@mui/material';

const reviewsData = [
  { stars: 5, percentage: 50 },
  { stars: 4, percentage: 40 },
  { stars: 3, percentage: 30 },
  { stars: 2, percentage: 20 },
  { stars: 1, percentage: 10 },
];

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#ffc107',
  },
}));


const ReviewsCard = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>4.5/5</Typography>
          <StyledRating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">Total 650 customer review</Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          {reviewsData.slice().reverse().map((review) => (
            <Grid container key={review.stars} alignItems="center" spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">{review.stars} Star</Typography>
              </Grid>
              <Grid item xs={8}>
                <LinearProgress
                  variant="determinate"
                  value={review.percentage}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary" align="right">{review.percentage}%</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewsCard;
