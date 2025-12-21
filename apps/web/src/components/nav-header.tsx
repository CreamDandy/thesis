'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/stocks', label: 'Stocks' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/journal', label: 'Journal' },
];

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Conditionally import Clerk components
let SignedIn: React.ComponentType<{ children: React.ReactNode }> | null = null;
let SignedOut: React.ComponentType<{ children: React.ReactNode }> | null = null;
let UserButton: React.ComponentType<{ afterSignOutUrl?: string; appearance?: object }> | null = null;

if (isClerkConfigured) {
  // Dynamic import would be better but for simplicity we use conditional
  const clerk = require('@clerk/nextjs');
  SignedIn = clerk.SignedIn;
  SignedOut = clerk.SignedOut;
  UserButton = clerk.UserButton;
}

function AuthButtons() {
  if (!isClerkConfigured || !SignedIn || !SignedOut || !UserButton) {
    // Fallback when Clerk is not configured
    return (
      <>
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">Get Started</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <SignedOut>
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">Get Started</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      </SignedIn>
    </>
  );
}

export function NavHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo / Brand */}
        <Link href="/" className="mr-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-semibold">Thesis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
