'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner"
import { useCartStore } from '@/store/cart';
import api from '@/lib/api';
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import type { Address } from '@/types/index'

const addressSchema = z.object({
    full_name: z.string().min(2, 'Full name is required'),
    address_line1: z.string().min(2, 'Address is required'),
    address_line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postal_code: z.string().min(2, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().optional(),
})

type AddressFormValues = z.infer<typeof addressSchema>

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
    },
};

export function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { totalAmount, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        mode: 'onTouched',
        defaultValues: {
            full_name: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            phone: '',
        },
    });

    async function handleSubmit(data: AddressFormValues) {
        if (!stripe || !elements) return;
        setLoading(true);
        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error('Card element not found');
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: data.full_name,
                    address: {
                        line1: data.address_line1,
                        line2: data.address_line2,
                        city: data.city,
                        state: data.state,
                        postal_code: data.postal_code,
                        country: data.country,
                    },
                    phone: data.phone,
                },
            });
            if (stripeError) throw new Error(stripeError.message);
            const response = await api.post('/orders/create/', {
                payment_method_id: paymentMethod.id,
                shipping_address: data,
            });
            clearCart();
            toast.success('Thank you for your purchase. You will receive a confirmation email shortly.');
            router.push(`/orders/${response.data.id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || error.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="full_name" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="name" placeholder="Full Name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="phone" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="tel" placeholder="Phone (optional)" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="address_line1" control={form.control} render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="address-line1" placeholder="Street address" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="address_line2" control={form.control} render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Address Line 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="address-line2" placeholder="Apartment, suite, etc. (optional)" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="city" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="address-level2" placeholder="City" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="state" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="address-level1" placeholder="State" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="postal_code" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="postal-code" placeholder="Postal Code" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="country" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="country" placeholder="Country" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-md bg-white dark:bg-card">
                            <CardElement options={cardElementOptions} />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-bold">
                        Total: ${totalAmount.toFixed(2)}
                    </div>
                    <Button
                        type="submit"
                        disabled={!stripe || loading}
                        size="lg"
                        className="px-8"
                    >
                        {loading ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}