'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { ModeToggle } from './mode-toggle';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink
} from '@/components/ui/navigation-menu'

export function Header() {
    const { user, logout } = useAuthStore();
    const { totalItems } = useCartStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl flex h-20 items-center px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="mr-8 flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-primary">
                    <span>E-Store</span>
                </Link>
                {/* Navigation Menu */}
                <nav className="hidden md:flex flex-1">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid grid-cols-2 gap-4 p-4 min-w-[300px]">
                                        <NavigationMenuLink href="/products/category/electronics">Electronics</NavigationMenuLink>
                                        <NavigationMenuLink href="/products/category/fashion">Fashion</NavigationMenuLink>
                                        <NavigationMenuLink href="/products/category/home">Home</NavigationMenuLink>
                                        <NavigationMenuLink href="/products/category/sports">Sports</NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Deals</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex flex-col gap-2 p-4 min-w-[200px]">
                                        <NavigationMenuLink href="/deals/today">Today's Deals</NavigationMenuLink>
                                        <NavigationMenuLink href="/deals/clearance">Clearance</NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/about">About Us</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
                            </NavigationMenuItem>
                            {user && (
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/orders">Orders</NavigationMenuLink>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
                {/* Spacer for right actions */}
                <div className="flex-1 md:hidden" />
                {/* Right actions */}
                <div className="flex items-center space-x-2">
                    <ModeToggle />
                    {user && (
                        <Button variant="ghost" size="sm" asChild className="relative">
                            <Link href="/cart">
                                <ShoppingCart className="h-6 w-6" />
                                {totalItems > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                                    >
                                        {totalItems}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                    )}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex items-center">
                                    <User className="h-6 w-6" />
                                    <span className="ml-2 hidden md:inline font-medium">
                                        {user.first_name || user.username}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/orders">Orders</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
                {/* Mobile menu */}
                <div className="md:hidden ml-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pl-1 pr-0 w-64">
                            <div className="px-7 py-4 border-b">
                                <Link href="/" className="flex items-center text-xl font-bold">
                                    E-Store
                                </Link>
                            </div>
                            <div className="my-4 pb-10 pl-6 flex flex-col space-y-4">
                                <Link href="/">Products</Link>
                                <Link href="/deals">Deals</Link>
                                <Link href="/about">About Us</Link>
                                <Link href="/contact">Contact</Link>
                                {user && <Link href="/orders">Orders</Link>}
                                <div className="flex items-center space-x-2 mt-4">
                                    {user ? (
                                        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                                    ) : (
                                        <>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button size="sm" asChild>
                                                <Link href="/register">Sign Up</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}