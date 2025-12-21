import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StocksLoading() {
  return (
    <div className="container py-8">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>

      <div className="space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-72 mt-1" />
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="border-b pb-3 mb-3">
              <div className="grid grid-cols-7 gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-28 hidden md:block" />
                <Skeleton className="h-4 w-14 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto hidden lg:block" />
                <Skeleton className="h-4 w-10 ml-auto hidden md:block" />
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="grid grid-cols-7 gap-4 py-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-32 hidden sm:block" />
                  <Skeleton className="h-5 w-24 hidden md:block" />
                  <Skeleton className="h-5 w-16 ml-auto" />
                  <Skeleton className="h-5 w-14 ml-auto" />
                  <Skeleton className="h-5 w-16 ml-auto hidden lg:block" />
                  <Skeleton className="h-5 w-10 ml-auto hidden md:block" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
