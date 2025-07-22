'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';
import { Order } from '@/types';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/');
            setOrders(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-8">
                <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-4 w-1/6 mb-4" />
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Button asChild>
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Order #{order.id}</CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
                                        >
                                            {order.status}
                                        </Badge>
                                        <p className="text-lg font-bold mt-1">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span>{item.product.name} × {item.quantity}</span>
                                            <span>${parseFloat(item.total_price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}