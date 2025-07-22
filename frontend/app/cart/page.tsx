'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

export default function CartPage() {
    const { user } = useAuthStore();
    const { cart, updateCart, removeFromCart, totalAmount, loading, fetchCart } = useCartStore();

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    if (!user) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Please login to view your cart</h1>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    if (cart.length === 0 && !loading) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                        <Image
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium truncate">{item.product.name}</h3>
                                        <p className="text-gray-600">${parseFloat(item.product.price).toFixed(2)} each</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={item.product.inventory_count}
                                            value={item.quantity}
                                            onChange={(e) => updateCart(item.id, parseInt(e.target.value) || 1)}
                                            className="w-20"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="text-lg font-semibold">
                                        ${parseFloat(item.total_price).toFixed(2)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button className="w-full mt-6" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}