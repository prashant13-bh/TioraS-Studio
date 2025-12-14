
'use server';

import type { Design, Order } from '@/lib/types';
import { getMockDashboardData } from '@/lib/mock-data';

// This file now uses mock data.
// In a real application, you would use getCurrentUser to get the user's ID
// and then fetch their specific data from Firestore.

export async function getUserDashboardData() {
    // const user = await getCurrentUser();
    // if (!user) {
    //     throw new Error('Authentication required to fetch dashboard data.');
    // }
    
    // For now, we return mock data.
    const mockData = getMockDashboardData();

    return { 
        savedDesigns: mockData.savedDesigns, 
        orderHistory: mockData.orderHistory 
    };
}
