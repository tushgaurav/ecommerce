'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner"
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import api from '@/lib/api';
import { Product, ApiResponse } from '@/types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ProductCard } from '@/components/products/product-card';
import { Reviews } from '@/components/products/reviews';

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const { user } = useAuthStore();
    const { addToCart, loading: cartLoading } = useCartStore();

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    useEffect(() => {
        if (product) fetchRelatedProducts(product.id);
    }, [product]);

    const fetchProduct = async (id: string) => {
        try {
            const response = await api.get<Product>(`/products/${id}/`);
            setProduct(response.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (currentProductId: number) => {
        setRelatedLoading(true);
        try {
            const response = await api.get<ApiResponse<Product>>('/products/');
            // Exclude current product and pick up to 4 others
            const allProducts = response.data.results || [];
            const related = allProducts
                .filter((p: Product) => p.id !== currentProductId)
                .slice(0, 4);
            setRelatedProducts(related);
        } catch (error) {
            console.error('Failed to fetch related products:', error);
        } finally {
            setRelatedLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Authentication required', {
                description: 'Please login to add items to cart',
            });
            return;
        }

        if (!product) return;

        try {
            await addToCart(product.id, quantity);
            toast.success(`${quantity} x ${product.name} has been added to your cart`);
        } catch (error) {
            toast.error('Failed to add product to cart');
        }
    };

    if (loading) {
        return (
            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-96 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted flex items-center justify-center shadow-md">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </div>

                <div className="space-y-8 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">${parseFloat(product.price).toFixed(2)}</p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-2 text-base">{product.description}</p>
                        <Badge variant={product.inventory_count > 0 ? 'default' : 'secondary'} className="mt-2">
                            {product.inventory_count > 0 ? `${product.inventory_count} in stock` : 'Out of stock'}
                        </Badge>
                        <div className="mt-6 border rounded-lg bg-card p-4 md:p-6 shadow-sm">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="info">
                                    <AccordionTrigger>Product Information</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="warranty">
                                    <AccordionTrigger>Warranty</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300">All products come with a 1-year limited warranty covering manufacturing defects. Contact support for more details.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                        <Label htmlFor="quantity">Quantity:</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.inventory_count}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-20"
                        />
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={cartLoading || product.inventory_count === 0}
                        className="w-full mt-2"
                        size="lg"
                    >
                        {cartLoading
                            ? 'Adding...'
                            : product.inventory_count === 0
                                ? 'Out of Stock'
                                : 'Add to Cart'
                        }
                    </Button>
                </div>
            </div>

            {/* Related Products */}
            <section className="mt-16">
                <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
                <div className="flex gap-6 overflow-x-auto pb-2">
                    {relatedLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[260px] max-w-xs">
                                <Skeleton className="h-72 w-full rounded-xl" />
                            </div>
                        ))
                    ) : relatedProducts.length === 0 ? (
                        <div className="text-muted-foreground">No related products found.</div>
                    ) : (
                        relatedProducts.map((related) => (
                            <div key={related.id} className="min-w-[260px] max-w-xs">
                                <ProductCard product={related} />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Customer Reviews */}
            <Reviews />
        </div>
    );
}