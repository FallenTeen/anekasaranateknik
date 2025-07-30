<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Keranjang;
use App\Models\UserLikesBarang;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    private function getSharedData()
    {
        $favorites = [];
        $cartCount = 0;

        if (auth()->check()) {
            $favorites = UserLikesBarang::where('user_id', auth()->id())
                ->where('liked', true)
                ->pluck('barang_id')
                ->toArray();

            $cartCount = Keranjang::where('user_id', auth()->id())
                ->sum('jumlah');
        }

        return [
            'favorites' => $favorites,
            'cartCount' => $cartCount
        ];
    }

    public function index()
    {
        $products = Barang::where('display', true)
            ->select([
                'id',
                'nama_barang',
                'kode_barang',
                'deskripsi',
                'gambar',
                'harga_jual',
                'diskon',
                'kategori',
                'stok',
                'status_rekomendasi',
                'created_at'
            ])
            ->withCount([
                'userLikes as total_likes' => function ($query) {
                    $query->where('liked', true);
                },
                'feedbacks'
            ])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                $item->feedbacks_count = $item->feedbacks->count();
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        $sharedData = $this->getSharedData();

        return Inertia::render('public_list_all_produk', [
            'products' => $products,
            'categories' => $categories,
            'favorites' => $sharedData['favorites'],
            'cartCount' => $sharedData['cartCount'],
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');

        $products = Barang::where('display', true)
            ->select([
                'id',
                'nama_barang',
                'kode_barang',
                'deskripsi',
                'gambar',
                'harga_jual',
                'diskon',
                'kategori',
                'stok',
                'status_rekomendasi',
                'created_at'
            ])
            ->where(function ($q) use ($query) {
                $q->where('nama_barang', 'like', "%{$query}%")
                    ->orWhere('deskripsi', 'like', "%{$query}%")
                    ->orWhere('kategori', 'like', "%{$query}%");
            })
            ->withCount([
                'userLikes as total_likes' => function ($query) {
                    $query->where('liked', true);
                },
                'feedbacks'
            ])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                $item->feedbacks_count = $item->feedbacks->count();
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        $sharedData = $this->getSharedData();

        return Inertia::render('public_list_all_produk', [
            'products' => $products,
            'categories' => $categories,
            'searchQuery' => $query,
            'favorites' => $sharedData['favorites'],
            'cartCount' => $sharedData['cartCount'],
        ]);
    }

    public function byCategory($kategori)
    {
        $products = Barang::where('display', true)
            ->where('kategori', $kategori)
            ->select([
                'id',
                'nama_barang',
                'kode_barang',
                'deskripsi',
                'gambar',
                'harga_jual',
                'diskon',
                'kategori',
                'stok',
                'status_rekomendasi',
                'created_at'
            ])
            ->withCount([
                'userLikes as total_likes' => function ($query) {
                    $query->where('liked', true);
                },
                'feedbacks'
            ])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                // Calculate discounted price
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                $item->feedbacks_count = $item->feedbacks->count();
                unset($item->feedbacks);
                return $item;
            });

        $categories = Barang::where('display', true)
            ->distinct()
            ->pluck('kategori')
            ->filter()
            ->sort()
            ->values();

        $sharedData = $this->getSharedData();

        return Inertia::render('public_list_by_kategori', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $kategori,
            'favorites' => $sharedData['favorites'],
            'cartCount' => $sharedData['cartCount'],
        ]);
    }

    public function show($id)
    {
        $product = Barang::where('display', true)
            ->select([
                'id',
                'nama_barang',
                'kode_barang',
                'deskripsi',
                'gambar',
                'gambar_deskripsi',
                'harga_jual',
                'diskon',
                'kategori',
                'stok',
                'status_rekomendasi',
                'created_at'
            ])
            ->withCount([
                'userLikes as total_likes' => function ($query) {
                    $query->where('liked', true);
                },
                'feedbacks'
            ])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->findOrFail($id);
        $product->harga_setelah_diskon = $product->harga_jual - ($product->harga_jual * $product->diskon / 100);
        $product->average_rating = $product->feedbacks->avg('rating') ?? 0;
        $product->feedbacks_count = $product->feedbacks->count();
        unset($product->feedbacks);

        $relatedProducts = Barang::where('display', true)
            ->where('id', '!=', $id)
            ->where('kategori', $product->kategori)
            ->select([
                'id',
                'nama_barang',
                'harga_jual',
                'diskon',
                'gambar',
                'kategori',
                'stok',
                'status_rekomendasi'
            ])
            ->withCount([
                'userLikes as total_likes' => function ($query) {
                    $query->where('liked', true);
                },
                'feedbacks'
            ])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->limit(4)
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                $item->feedbacks_count = $item->feedbacks->count();
                unset($item->feedbacks);
                return $item;
            });

        $sharedData = $this->getSharedData();

        return Inertia::render('public_detail_produk', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'favorites' => $sharedData['favorites'],
            'cartCount' => $sharedData['cartCount'],
        ]);
    }

    public function toggleFavorite(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:tb_barang,id'
            ]);

            if (!auth()->check()) {
                return response()->json([
                    'error' => 'Silakan login terlebih dahulu untuk menambahkan ke favorit'
                ], 401);
            }

            $productId = $request->product_id;
            $userId = auth()->id();
            $product = Barang::where('id', $productId)
                ->where('display', true)
                ->first();

            if (!$product) {
                return response()->json([
                    'error' => 'Produk tidak ditemukan atau tidak tersedia'
                ], 404);
            }

            $existingLike = UserLikesBarang::where('user_id', $userId)
                ->where('barang_id', $productId)
                ->first();

            $isLiked = false;
            $message = '';

            if ($existingLike) {
                $newStatus = !$existingLike->liked;
                $existingLike->update(['liked' => $newStatus]);
                $existingLike->refresh();
                $isLiked = $existingLike->liked;

                $message = $isLiked ? 'Produk ditambahkan ke favorit' : 'Produk dihapus dari favorit';
                if ($isLiked) {
                    try {
                        if (class_exists('App\Models\Notifikasi')) {
                            Notifikasi::createItemLikedNotification(auth()->user(), $product);
                        }
                    } catch (\Exception $e) {
                        \Log::error('Notification error: ' . $e->getMessage());
                    }
                }
            } else {
                UserLikesBarang::create([
                    'user_id' => $userId,
                    'barang_id' => $productId,
                    'liked' => true
                ]);

                $isLiked = true;
                $message = 'Produk ditambahkan ke favorit';

                try {
                    if (class_exists('App\Models\Notifikasi')) {
                        Notifikasi::createItemLikedNotification(auth()->user(), $product);
                    }
                } catch (\Exception $e) {
                    \Log::error('Notification error: ' . $e->getMessage());
                }
            }
            $favoritesCount = UserLikesBarang::where('user_id', $userId)
                ->where('liked', true)
                ->count();
            $cartCount = Keranjang::where('user_id', $userId)->sum('jumlah');

            return response()->json([
                'message' => $message,
                'isLiked' => $isLiked,
                'favoritesCount' => $favoritesCount,
                'cartCount' => $cartCount,
                'success' => true
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Data yang dikirim tidak valid',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Toggle favorite error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'
            ], 500);
        }
    }
}