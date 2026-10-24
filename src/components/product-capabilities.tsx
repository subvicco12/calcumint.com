'use client';
import {createContext,useContext,type ReactNode} from 'react';
import {capabilitiesForMode,type ProductCapabilities} from '@/lib/product-mode';
const Capabilities = createContext<ProductCapabilities>(capabilitiesForMode('invalid'));
export function ProductCapabilitiesProvider({capabilities,children}:{capabilities:ProductCapabilities;children:ReactNode}) {
  return <Capabilities.Provider value={capabilities}>{children}</Capabilities.Provider>;
}
export function useProductCapabilities() { return useContext(Capabilities); }
