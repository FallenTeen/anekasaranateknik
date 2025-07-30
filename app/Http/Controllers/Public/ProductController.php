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

    private function formatProductImage($product)
    {
        if ($product->gambar) {
            $product->gambar_url = '/assets/images/barang/' . $product->gambar;
        } else {
            $product->gambar_url = '/api/placeholder/300/220';
        }
        return $product;
    }

    private function formatProductImages($product)
    {
        if ($product->gambar) {
            $product->gambar_url = '/assets/images/barang/' . $product->gambar;
        } else {
            $product->gambar_url = '/api/placeholder/300/220';
        }

        if ($product->gambar_deskripsi) {
            try {
                $gambarDeskripsi = json_decode($product->gambar_deskripsi, true);
                if (is_array($gambarDeskripsi)) {
                    $product->gambar_deskripsi_urls = array_map(function($img) {
                        return '/assets/images/barang/' . $img;
                    }, $gambarDeskripsi);
                } else {
                    $product->gambar_deskripsi_urls = [];
                }
            } catch (\Exception $e) {
                $product->gambar_deskripsi_urls = [];
            }
        } else {
            $product->gambar_deskripsi_urls = [];
        }

        return $product;
    }

    public function getCurrentUserFavorites()
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'favorites' => [],
                    'favoritesCount' => 0
                ]);
            }

            $favorites = UserLikesBarang::where('user_id', auth()->id())
                ->where('liked', true)
                ->pluck('barang_id')
                ->toArray();

            return response()->json([
                'favorites' => $favorites,
                'favoritesCount' => count($favorites)
            ]);

        } catch (\Exception $e) {
            \Log::error('Get current user favorites error: ' . $e->getMessage());
            return response()->json([
                'favorites' => [],
                'favoritesCount' => 0
            ]);
        }
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
                return $this->formatProductImage($item);
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
                return $this->formatProductImage($item);
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
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                $item->feedbacks_count = $item->feedbacks->count();
                unset($item->feedbacks);
                return $this->formatProductImage($item);
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

        // Format images
        $product = $this->formatProductImages($product);

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
                return $this->formatProductImage($item);
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
                    'error' => 'Silakan login terlebih dahulu'
                ], 401);
            }

            $productId = $request->product_id;
            $userId = auth()->id();

            $product = Barang::where('id', $productId)
                ->where('display', true)
                ->first();

            if (!$product) {
                return response()->json([
                    'error' => 'Produk tidak ditemukan'
                ], 404);
            }

            $likeRecord = UserLikesBarang::where('user_id', $userId)
                ->where('barang_id', $productId)
                ->first();

            $isLiked = false;

            if ($likeRecord) {
                $likeRecord->liked = !$likeRecord->liked;
                $likeRecord->save();
                $isLiked = $likeRecord->liked;
            } else {
                UserLikesBarang::create([
                    'user_id' => $userId,
                    'barang_id' => $productId,
                    'liked' => true
                ]);
                $isLiked = true;
            }

            $favoritesCount = UserLikesBarang::where('user_id', $userId)
                ->where('liked', true)
                ->count();

            $cartCount = Keranjang::where('user_id', $userId)
                ->sum('jumlah');

            return response()->json([
                'success' => true,
                'isLiked' => $isLiked,
                'favoritesCount' => $favoritesCount,
                'cartCount' => $cartCount,
                'message' => $isLiked ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit'
            ]);

        } catch (\Exception $e) {
            \Log::error('Toggle favorite error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan sistem'
            ], 500);
        }
    }

    public function getLikedProducts()
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'likedItems' => [],
                    'count' => 0
                ]);
            }

            $likedItems = Barang::whereHas('userLikes', function ($query) {
                $query->where('user_id', auth()->id())
                    ->where('liked', true);
            })
                ->where('display', true)
                ->select([
                    'id',
                    'nama_barang',
                    'gambar',
                    'harga_jual',
                    'deskripsi'
                ])
                ->get()
                ->map(function ($item) {
                    return $this->formatProductImage($item);
                });

            return response()->json([
                'likedItems' => $likedItems,
                'count' => $likedItems->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'likedItems' => [],
                'count' => 0
            ]);
        }
    }

    public function getNavbarProducts()
    {
        try {
            $recommendedProducts = Barang::where('display', true)
                ->where('status_rekomendasi', true)
                ->whereNotNull('gambar')
                ->where('gambar', '!=', '')
                ->select([
                    'id',
                    'nama_barang',
                    'gambar',
                    'harga_jual',
                    'deskripsi'
                ])
                ->limit(8)
                ->get()
                ->map(function ($product) {
                    return $this->formatProductImage($product);
                });

            $categories = Barang::where('display', true)
                ->whereNotNull('kategori')
                ->where('kategori', '!=', '')
                ->select('kategori')
                ->distinct()
                ->pluck('kategori')
                ->take(3);

            $categoriesWithTopItems = [];
            foreach ($categories as $categoryName) {
                $topItems = Barang::where('kategori', $categoryName)
                    ->where('status_rekomendasi', true)
                    ->where('display', true)
                    ->whereNotNull('gambar')
                    ->where('gambar', '!=', '')
                    ->select([
                        'id',
                        'nama_barang',
                        'gambar',
                        'harga_jual',
                        'deskripsi'
                    ])
                    ->take(3)
                    ->get()
                    ->map(function ($product) {
                        return $this->formatProductImage($product);
                    });

                if ($topItems->count() > 0) {
                    $categoriesWithTopItems[] = [
                        'category' => [
                            'nama_kategori' => $categoryName,
                            'deskripsi' => 'Produk ' . $categoryName . ' terbaik'
                        ],
                        'topItems' => $topItems
                    ];
                }
            }

            return response()->json([
                'recommended' => $recommendedProducts,
                'categories' => $categoriesWithTopItems
            ]);

        } catch (\Exception $e) {
            \Log::error('Get navbar products error: ' . $e->getMessage());
            return response()->json([
                'recommended' => [],
                'categories' => []
            ]);
        }
    }
}