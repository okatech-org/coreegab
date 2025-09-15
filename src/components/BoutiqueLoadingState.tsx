import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Package } from 'lucide-react';

export const BoutiqueLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        {/* Skeleton pour le menu */}
        <div className="w-80 h-full bg-muted rounded-lg animate-pulse" />
      </div>
      
      <div className="flex-1 lg:pl-[340px]">
        {/* Header skeleton */}
        <div className="h-16 bg-muted animate-pulse mb-4" />
        
        <div className="p-6 space-y-6">
          {/* Sélecteur de véhicule skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>

          {/* Barre de recherche skeleton */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Grille de produits skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="group">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg animate-pulse" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
