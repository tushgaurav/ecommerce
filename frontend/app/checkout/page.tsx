'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { user } = useAuthStore();
    const { cart } = useCartStore();

    if (!user) {
        return (
            <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-3xl font-bold mb-6">Please login to checkout</h1>
                <Button asChild size="lg" className="px-8">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-3xl font-bold mb-6">Your cart is empty</h1>
                <Button asChild size="lg" className="px-8">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-12 max-w-5xl">
            <h1 className="text-4xl font-bold mb-10 text-center">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 flex flex-col gap-4">
                            <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
                            <ul className="divide-y divide-border">
                                {cart.map(item => (
                                    <li key={item.id} className="py-3 flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.product.name}</div>
                                            <div className="text-muted-foreground text-sm">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold">${parseFloat(item.total_price).toFixed(2)}</div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center border-t pt-4 mt-2">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold">
                                    ${cart.reduce((sum, item) => sum + parseFloat(item.total_price), 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}