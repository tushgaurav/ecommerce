'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner"
import { useAuthStore } from '@/store/auth';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.username, formData.password);
            toast.success('You have been successfully logged in.');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/60 to-background dark:from-background dark:via-muted/40 dark:to-background">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background/80 to-background pointer-events-none" aria-hidden="true" />
            <Card className="relative z-10 w-full max-w-md border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card/80 backdrop-blur-md">
                <CardHeader className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 dark:bg-primary/20 mb-2">
                        <Lock className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Sign In</CardTitle>
                    <CardDescription className="text-center text-muted-foreground text-base">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} autoComplete="on" className="space-y-0">
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                required
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                aria-label="Username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                aria-label="Password"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col mt-4 gap-4 items-center">
                        <Button type="submit" className="w-full font-medium text-base py-2.5 mt-2" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-medium text-primary hover:underline focus-visible:underline outline-none transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}