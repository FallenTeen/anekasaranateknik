<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Keranjang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = [];
        
        if (auth()->check()) {
            $cartItems = Keranjang::where('user_id', auth()->id())
                ->with('barang')
                ->get()
                ->map(function ($item) {
                    $item->barang->harga_setelah_diskon = $item->barang->harga_jual - ($item->barang->harga_jual * $item->barang->diskon / 100);
                    return $item;
                });
        }

        return Inertia::render('public_keranjang', [
            'cartItems' => $cartItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:tb_barang,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if (!auth()->check()) {
            return response()->json(['error' => 'Please login to add items to cart'], 401);
        }

        $product = Barang::findOrFail($request->product_id);
        
        if (!$product->display) {
            return response()->json(['error' => 'Product not available'], 400);
        }

        $existingCart = Keranjang::where('user_id', auth()->id())
            ->where('id_barang', $request->product_id)
            ->first();

        if ($existingCart) {
            $existingCart->update([
                'quantity' => $existingCart->quantity + $request->quantity
            ]);
        } else {
            Keranjang::create([
                'user_id' => auth()->id(),
                'id_barang' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if (!auth()->check()) {
            return response()->json(['error' => 'Please login to update cart'], 401);
        }

        $cartItem = Keranjang::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json(['message' => 'Cart updated successfully']);
    }

    public function remove($id)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Please login to remove items from cart'], 401);
        }

        $cartItem = Keranjang::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart successfully']);
    }

    public function clear()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Please login to clear cart'], 401);
        }

        Keranjang::where('user_id', auth()->id())->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
} 