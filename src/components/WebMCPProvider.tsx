'use client';

import { useEffect, useRef } from 'react';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

export default function WebMCPProvider() {
    const store = useWatchlistStore();
    const storeRef = useRef(store);

    // Keep ref current on every render without triggering re-registration
    useEffect(() => {
        storeRef.current = store;
    });

    useEffect(() => {
        const modelContext = (navigator as any).modelContext || (navigator as any).modelContextTesting;

        if (typeof window === 'undefined' || !modelContext) {
            console.warn('WebMCP: navigator.modelContext not found. Ensure "WebMCP for testing" flag is enabled in chrome://flags');
            return;
        }

        console.log('WebMCP: Model Context API detected. Registering tools...');

        modelContext.registerTool({
            name: 'get_watchlist',
            description: 'Returns the list of stocks in the user\'s watchlists grouped by category',
            parameters: { type: 'object', properties: {} },
            execute: async () => {
                return storeRef.current.groups.map(g => ({
                    id: g.id,
                    name: g.name,
                    items: g.items.map(i => i.symbol)
                }));
            }
        });

        modelContext.registerTool({
            name: 'add_to_watchlist',
            description: 'Adds a stock symbol to a specific watchlist group by ID',
            parameters: {
                type: 'object',
                properties: {
                    symbol: { type: 'string', description: 'Stock symbol (e.g., AAPL)' },
                    groupId: { type: 'string', description: 'The ID of the group to add to' }
                },
                required: ['symbol', 'groupId']
            },
            execute: async ({ symbol, groupId }: { symbol: string, groupId: string }) => {
                storeRef.current.addItem(groupId, symbol);
                return { success: true, message: `Added ${symbol} to group ${groupId}` };
            }
        });

        modelContext.registerTool({
            name: 'remove_from_watchlist',
            description: 'Removes a stock symbol from a specific watchlist group',
            parameters: {
                type: 'object',
                properties: {
                    symbol: { type: 'string', description: 'Stock symbol to remove' },
                    groupId: { type: 'string', description: 'The ID of the group' }
                },
                required: ['symbol', 'groupId']
            },
            execute: async ({ symbol, groupId }: { symbol: string, groupId: string }) => {
                storeRef.current.removeItem(groupId, symbol);
                return { success: true, message: `Removed ${symbol} from group ${groupId}` };
            }
        });

        modelContext.registerTool({
            name: 'create_watchlist_group',
            description: 'Creates a new empty watchlist group with the given name',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Name of the new watchlist group' }
                },
                required: ['name']
            },
            execute: async ({ name }: { name: string }) => {
                const id = storeRef.current.createGroup(name);
                return { success: !!id, groupId: id, message: id ? `Created group ${name}` : 'Failed to create group (limit reached?)' };
            }
        });

        return () => {
            modelContext.unregisterTool('get_watchlist');
            modelContext.unregisterTool('add_to_watchlist');
            modelContext.unregisterTool('remove_from_watchlist');
            modelContext.unregisterTool('create_watchlist_group');
        };
    }, []); // Register once on mount, clean up on unmount

    return null;
}
