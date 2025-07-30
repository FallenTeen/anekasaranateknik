<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Barang::where('display', true)
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with(['feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('public_list_all_produk', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        $products = Barang::where('display', true)
            ->where(function ($q) use ($query) {
                $q->where('nama_barang', 'like', "%{$query}%")
                  ->orWhere('deskripsi', 'like', "%{$query}%")
                  ->orWhere('kategori', 'like', "%{$query}%");
            })
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with(['feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('public_list_all_produk', [
            'products' => $products,
            'categories' => $categories,
            'searchQuery' => $query,
        ]);
    }

    public function byCategory($kategori)
    {
        $products = Barang::where('display', true)
            ->where('kategori', $kategori)
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with(['feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('public_list_by_kategori', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $kategori,
        ]);
    }

    public function show($id)
    {
        $product = Barang::where('display', true)
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with(['feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }])
            ->findOrFail($id);

        $product->harga_setelah_diskon = $product->harga_jual - ($product->harga_jual * $product->diskon / 100);
        $product->average_rating = $product->feedbacks->avg('rating') ?? 0;
        unset($product->feedbacks);

        $relatedProducts = Barang::where('display', true)
            ->where('id', '!=', $id)
            ->where('kategori', $product->kategori)
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with(['feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }])
            ->limit(4)
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                unset($item->feedbacks);
                return $item;
            });

        return Inertia::render('public_detail_produk', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
} 