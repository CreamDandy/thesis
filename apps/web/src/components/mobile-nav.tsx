'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
  const clerk = require('@clerk/nextjs');
  SignedIn = clerk.SignedIn;
  SignedOut = clerk.SignedOut;
  UserButton = clerk.UserButton;
}

function MobileAuthButtons({ closeNav }: { closeNav: () => void }) {
  if (!isClerkConfigured || !SignedIn || !SignedOut || !UserButton) {
    return (
      <>
        <Link href="/sign-in" onClick={closeNav}>
          <Button variant="ghost" className="w-full justify-start">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up" onClick={closeNav}>
          <Button className="w-full">Get Started</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <SignedOut>
        <Link href="/sign-in" onClick={closeNav}>
          <Button variant="ghost" className="w-full justify-start">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up" onClick={closeNav}>
          <Button className="w-full">Get Started</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
              },
            }}
          />
          <span className="text-sm text-muted-foreground">Account</span>
        </div>
      </SignedIn>
    </>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Thesis</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeNav}
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-4">
          <MobileAuthButtons closeNav={closeNav} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
