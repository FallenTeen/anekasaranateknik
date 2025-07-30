import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useShop } from '@/context/ShopContext';

export default function TestFavorites() {
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [tableInfo, setTableInfo] = useState<any>(null);
    const { favorites, favoritesCount, toggleFavorite, isLoading } = useShop();

    const testTableStructure = async () => {
        try {
            const response = await fetch('/public/debug/table-structure', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const data = await response.json();
            setTableInfo(data);
        } catch (error) {
            console.error('Error testing table structure:', error);
        }
    };

    const testFavorites = async () => {
        try {
            const response = await fetch('/public/debug/favorites', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const data = await response.json();
            setDebugInfo(data);
        } catch (error) {
            console.error('Error testing favorites:', error);
        }
    };

    const testToggleFavorite = async () => {
        // Test with a sample product ID (you'll need to replace with a real one)
        await toggleFavorite(1);
    };

    useEffect(() => {
        testTableStructure();
        testFavorites();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Favorites Debug Page</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Current State</h2>
                        <div className="space-y-2">
                            <p><strong>Favorites Count:</strong> {favoritesCount}</p>
                            <p><strong>Favorites Set:</strong> {Array.from(favorites).join(', ') || 'Empty'}</p>
                            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                        </div>
                        
                        <Button 
                            onClick={testToggleFavorite} 
                            disabled={isLoading}
                            className="mt-4"
                        >
                            Test Toggle Favorite (Product ID: 1)
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Database Table Info</h2>
                        {tableInfo ? (
                            <div className="space-y-2">
                                <p><strong>Table Exists:</strong> {tableInfo.table_exists ? 'Yes' : 'No'}</p>
                                <p><strong>Table Name:</strong> {tableInfo.table_name}</p>
                                <p><strong>Columns:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    {tableInfo.columns?.map((col: string, index: number) => (
                                        <li key={index}>{col}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Loading table info...</p>
                        )}
                        
                        <Button onClick={testTableStructure} className="mt-4">
                            Refresh Table Info
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Database Favorites</h2>
                        {debugInfo ? (
                            <div className="space-y-2">
                                <p><strong>User ID:</strong> {debugInfo.user_id}</p>
                                <p><strong>Count:</strong> {debugInfo.count}</p>
                                <p><strong>Favorites:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    {debugInfo.favorites?.map((fav: any, index: number) => (
                                        <li key={index}>
                                            Product {fav.barang_id}: {fav.barang?.nama_barang || 'Unknown'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Loading favorites...</p>
                        )}
                        
                        <Button onClick={testFavorites} className="mt-4">
                            Refresh Favorites
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 