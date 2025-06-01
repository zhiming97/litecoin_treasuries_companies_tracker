'use client'

import { useEffect, useState } from "react"
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

interface AssetPrice {
  Key: number;
  name: string;
  price: number;
  growth: number;
}

function AssetCard({ asset }: { asset: AssetPrice }) {
  const isPositive = Number(asset.growth) >= 0;

  // Function to get the appropriate icon path based on asset name
  const getAssetIconPath = (assetName: string) => {
    const name = assetName.toLowerCase();
    return `/crypto-icons/${name}.svg`;
  };

  return (
    <div className="flex items-center">
      <div className="w-6 h-6 relative mr-2">
        <Image
          src={getAssetIconPath(asset.name)}
          alt={`${asset.name} icon`}
          width={24}
          height={24}
        />
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{asset.name}</p>
        <p className="text-sm text-muted-foreground">
          ${typeof asset.price === 'number' ? asset.price.toFixed(2) : asset.price}
        </p>
      </div>
      <div className={`ml-auto font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {typeof asset.growth === 'number' ? asset.growth.toFixed(2) : asset.growth}%
      </div>
    </div>
  )
}


export function AssetPriceList({ initialAssets }: { initialAssets: AssetPrice[] }) {
  console.log('AssetPriceList component rendered with initialAssets:', initialAssets);
  
  const [assets, setAssets] = useState<AssetPrice[]>(() => {
    console.log('Initializing assets state with:', initialAssets);
    const uniqueAssets = new Map(initialAssets.map(asset => [asset.name, asset]));
    return Array.from(uniqueAssets.values());
  });
  
  // Effect to handle initialAssets changes
  useEffect(() => {
    console.log('initialAssets useEffect triggered with:', initialAssets);
    const uniqueAssets = new Map(initialAssets.map(asset => [asset.name, asset]));
    const newAssets = Array.from(uniqueAssets.values());
    console.log('Setting assets state to:', newAssets);
    setAssets(newAssets);
  }, [initialAssets]);

  useEffect(() => {
    // Initialize Supabase client
    console.log('Setting up Supabase real-time subscription');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    )

    // Enable real-time subscription for the table
    const channel = supabase
      .channel('asset_prices_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'asset_price'
        },
        (payload: any) => {
          console.log('Received real-time change event:', payload);
          setAssets(currentAssets => {
            console.log('Current assets before update:', currentAssets);
            const uniqueAssets = new Map(currentAssets.map(asset => [asset.name, asset]));
            
            if (payload.eventType === 'DELETE') {
              console.log('Handling DELETE event for:', payload.old.name);
              uniqueAssets.delete(payload.old.name);
            } else {
              console.log('Handling INSERT/UPDATE event for:', payload.new.name);
              uniqueAssets.set(payload.new.name, payload.new);
            }
            
            const updatedAssets = Array.from(uniqueAssets.values());
            console.log('Updated assets after change:', updatedAssets);
            return updatedAssets;
          });
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to real-time changes')
      }
    })

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up Supabase subscription')
      supabase.removeChannel(channel)
    }
  }, []) // Empty dependency array means this effect runs once on mount

  console.log('Rendering AssetPriceList with assets:', assets);
  return (
    <div className="space-y-8">
      {assets.map((asset) => (
        <AssetCard key={asset.name} asset={asset} />
      ))}
    </div>
  )
} 