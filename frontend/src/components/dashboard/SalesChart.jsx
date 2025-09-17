import React from 'react';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

const SalesChart = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const chartData = [
        { day: 'SAT', sales: 34000 },
        { day: 'SUN', sales: 49000 },
        { day: 'MON', sales: 48000 },
        { day: 'TUE', sales: 42000 },
        { day: 'WED', sales: 41000 },
        { day: 'THU', sales: 28000 },
        { day: 'FRI', sales: 22000 },
    ];

    return (
        <Card>
            <CardHeader title="Sales" />
            <CardContent>
                <Box sx={{ height: 300,  width: '100%' }}>
                     <BarChart
                        dataset={chartData}
                        xAxis={[{
                            scaleType: 'band',
                            dataKey: 'day',
                            tickLabelStyle: { fill: theme.palette.text.secondary }
                        }]}
                        yAxis={[{
                            tickLabelStyle: { fill: theme.palette.text.secondary }
                        }]}
                        series={[{ dataKey: 'sales', color: theme.palette.primary.main }]}
                        height={300}
                        margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
                        grid={{ horizontal: true }}
                        sx={{
                            '& .MuiChartsAxis-line': {
                                stroke: 'transparent',
                            },
                            '& .MuiChartsGrid-line': {
                                stroke: theme.palette.divider,
                                strokeDasharray: "3 3"
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default SalesChart;
