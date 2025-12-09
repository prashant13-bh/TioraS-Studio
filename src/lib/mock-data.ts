// This file contains mock data for features that are not yet connected to the backend.

export const getMockDashboardData = () => {
    return {
        savedDesigns: [
            {
                id: 'des_1',
                name: 'Cosmic Wolf',
                product: 'Hoodie',
                imageUrl: 'https://picsum.photos/seed/301/400/400',
            },
            {
                id: 'des_2',
                name: 'Sunset Cityscape',
                product: 'T-Shirt',
                imageUrl: 'https://picsum.photos/seed/302/400/400',
            },
            {
                id: 'des_3',
                name: 'Abstract Geometry',
                product: 'Jacket',
                imageUrl: 'https://picsum.photos/seed/303/400/400',
            },
            {
                id: 'des_4',
                name: 'Floral Skull',
                product: 'Cap',
                imageUrl: 'https://picsum.photos/seed/304/400/400',
            },
        ],
        orderHistory: [
            {
                id: 'ord_1',
                orderNumber: 'ORD-7005',
                date: 'June 15, 2024',
                status: 'Delivered',
                total: 8998.00,
            },
            {
                id: 'ord_2',
                orderNumber: 'ORD-7003',
                date: 'May 28, 2024',
                status: 'Delivered',
                total: 2499.00,
            },
             {
                id: 'ord_3',
                orderNumber: 'ORD-7001',
                date: 'April 12, 2024',
                status: 'Delivered',
                total: 12999.00,
            },
        ],
    };
}
