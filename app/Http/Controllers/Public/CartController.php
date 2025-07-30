<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Keranjang;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = [];
        $user = null;

        if (auth()->check()) {
            $user = auth()->user();
            $cartItems = Keranjang::where('user_id', auth()->id())
                ->with([
                    'barang' => function ($query) {
                        $query->where('display', true)
                            ->select([
                                'id',
                                'nama_barang',
                                'kode_barang',
                                'gambar',
                                'harga_jual',
                                'diskon',
                                'stok',
                                'kategori',
                                'status_rekomendasi'
                            ]);
                    }
                ])
                ->get()
                ->filter(function ($item) {
                    return $item->barang !== null;
                })
                ->map(function ($item) {
                    $item->barang->harga_setelah_diskon = $item->barang->harga_jual - ($item->barang->harga_jual * $item->barang->diskon / 100);
                    return $item;
                })
                ->values();
        }

        return Inertia::render('public_keranjang', [
            'cartItems' => $cartItems,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address' => $user->address ?? ''
            ] : null,
        ]);
    }

    public function add(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:tb_barang,id',
                'quantity' => 'required|integer|min:1|max:999',
            ]);

            if (!auth()->check()) {
                return response()->json([
                    'error' => 'Silakan login terlebih dahulu untuk menambahkan item ke keranjang'
                ], 401);
            }

            $product = Barang::findOrFail($request->product_id);

            if (!$product->display) {
                return response()->json([
                    'error' => 'Produk tidak tersedia'
                ], 400);
            }

            $quantity = max(1, intval($request->quantity));

            if ($quantity > intval($product->stok)) {
                return response()->json([
                    'error' => "Stok tidak mencukupi. Stok tersedia: {$product->stok}"
                ], 400);
            }

            $existingCart = Keranjang::where('user_id', auth()->id())
                ->where('barang_id', $request->product_id)
                ->first();

            if ($existingCart) {
                $newQuantity = $existingCart->jumlah + $quantity;

                if ($newQuantity > intval($product->stok)) {
                    return response()->json([
                        'error' => "Total quantity melebihi stok. Anda sudah memiliki {$existingCart->jumlah} item di keranjang, stok tersedia: {$product->stok}"
                    ], 400);
                }

                $existingCart->update([
                    'jumlah' => $newQuantity
                ]);
            } else {
                Keranjang::create([
                    'user_id' => auth()->id(),
                    'barang_id' => $request->product_id,
                    'jumlah' => $quantity,
                ]);
            }

            try {
                if (class_exists('App\Models\Notifikasi')) {
                    Notifikasi::createItemAddedToCartNotification(auth()->user(), $product, $quantity);
                }
            } catch (\Exception $e) {
                \Log::error('Notification error: ' . $e->getMessage());
            }

            $cartCount = Keranjang::where('user_id', auth()->id())->sum('jumlah');

            return response()->json([
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'cartCount' => $cartCount,
                'success' => true
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Data yang dikirim tidak valid',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Cart add error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:999',
            ]);

            if (!auth()->check()) {
                return response()->json([
                    'error' => 'Silakan login terlebih dahulu'
                ], 401);
            }

            $cartItem = Keranjang::where('id', $id)
                ->where('user_id', auth()->id())
                ->with([
                    'barang' => function ($query) {
                        $query->select([
                            'id',
                            'nama_barang',
                            'harga_jual',
                            'diskon',
                            'stok',
                            'display'
                        ]);
                    }
                ])
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'error' => 'Item tidak ditemukan di keranjang'
                ], 404);
            }

            if (!$cartItem->barang || !$cartItem->barang->display) {
                return response()->json([
                    'error' => 'Produk tidak lagi tersedia'
                ], 400);
            }

            $quantity = max(1, intval($request->quantity));

            if ($quantity > intval($cartItem->barang->stok)) {
                return response()->json([
                    'error' => "Stok tidak mencukupi. Stok tersedia: {$cartItem->barang->stok}"
                ], 400);
            }

            $cartItem->update([
                'jumlah' => $quantity
            ]);

            $cartItem->barang->harga_setelah_diskon = $cartItem->barang->harga_jual - ($cartItem->barang->harga_jual * $cartItem->barang->diskon / 100);

            return response()->json([
                'message' => 'Keranjang berhasil diupdate',
                'item' => $cartItem->load('barang')
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Quantity tidak valid',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'
            ], 500);
        }
    }

    public function remove($id)
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'error' => 'Silakan login terlebih dahulu'
                ], 401);
            }

            $cartItem = Keranjang::where('id', $id)
                ->where('user_id', auth()->id())
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'error' => 'Item tidak ditemukan di keranjang'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'message' => 'Item berhasil dihapus dari keranjang'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'
            ], 500);
        }
    }

    public function clear()
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'error' => 'Silakan login terlebih dahulu'
                ], 401);
            }

            $deletedCount = Keranjang::where('user_id', auth()->id())->delete();

            return response()->json([
                'message' => 'Keranjang berhasil dikosongkan',
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'
            ], 500);
        }
    }

    public function getCount()
    {
        $count = 0;

        if (auth()->check()) {
            $count = Keranjang::where('user_id', auth()->id())->sum('jumlah');
        }

        return response()->json([
            'cartCount' => $count
        ]);
    }
}
