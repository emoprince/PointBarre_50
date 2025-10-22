import type { FC } from 'react';

export interface EventQuoteDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personCount: string;
  croissantCount: string;
  biscuitPacks: string;
  wantsCustomCups: boolean;
  customCupsNotes: string;
  wantsCustomDrink: boolean;
  customDrinkNotes: string;
  wantsMusicAmbiance: boolean;
  musicAmbianceNotes: string;
}

// FIX: Add missing CoffeeOrder interface.
export interface CoffeeOrder {
  coffeeType: string;
  size: string;
  milk: string;
  syrup: string;
  extraShots: number;
}

// FIX: Add missing CoffeeOption interface.
export interface CoffeeOption {
  name: string;
  price: number;
  icon?: FC<{ className?: string }>;
}
