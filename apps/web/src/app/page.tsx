import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Thesis</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/stocks">
                <Button variant="ghost">Stocks</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-20">
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              The investment research platform that{' '}
              <span className="text-primary">remembers why you bought</span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              AI-powered stock analysis for position investors. Research stocks, document your thesis, 
              and track whether your investment case still holds over time.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-up">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/stocks">
              <Button variant="outline" size="lg">
                Browse Stock Reports
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  AI Stock Reports
                </CardTitle>
                <CardDescription>
                  Plain-English analysis for every S&P 500 stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get synthesized bull/bear cases, valuation assessments, and key metrics 
                  explained in terms anyone can understand. Updated on earnings, major news, 
                  and weekly refreshes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Thesis Tracking
                </CardTitle>
                <CardDescription>
                  Document why you bought, review if it still holds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Write your investment thesis when you buy. Get prompted to review when 
                  price drops 20%, earnings release, or your thesis gets stale. Build your 
                  investment thinking archive.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Strategy Fit
                </CardTitle>
                <CardDescription>
                  See how stocks match your investment criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Define your strategy (dividend growth, value, momentum). See instant 
                  pass/fail checks against your criteria. Calculate portfolio impact 
                  before you buy.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50">
          <div className="container flex flex-col items-center gap-4 py-12 md:py-20">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to invest with discipline?
            </h2>
            <p className="text-muted-foreground">
              Start with 3 free stock reports per month. Upgrade for unlimited access.
            </p>
            <Link href="/sign-up">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Thesis. For educational purposes only. Not investment advice.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
