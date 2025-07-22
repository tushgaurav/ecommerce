'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner"
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuthStore();
    const { addToCart, loading } = useCartStore();

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Authentication required', {
                description: 'Please login to add items to cart',
            })
            return
        }

        try {
            await addToCart(product.id)
            toast.success(`${product.name} has been added to your cart`)
        } catch (error) {
            toast.error('Failed to add product to cart')
        }
    }

    return (
        <Card className="group border-none shadow-none p-0 rounded-2xl overflow-hidden flex flex-col items-center justify-between w-full h-auto bg-card text-card-foreground">
            <div className="relative w-full aspect-square flex items-center justify-center bg-muted">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={320}
                        height={320}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-200"
                        priority={false}
                    />
                </Link>
                <Badge
                    className="absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow"
                    variant={product.inventory_count > 0 ? 'default' : 'secondary'}
                >
                    {product.inventory_count > 0 ? `${product.inventory_count} in stock` : 'Out of stock'}
                </Badge>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-3 w-full gap-1">
                <h3 className="text-base font-semibold text-center leading-tight line-clamp-2">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-muted-foreground text-center line-clamp-2 min-h-[32px]">{product.description}</p>
                <span className="mt-2 text-lg font-bold text-center block">
                    ${parseFloat(product.price).toFixed(2)}
                </span>
            </div>
        </Card>
    )
}