<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Barang;
use App\Models\Keranjang;
use App\Models\Notifikasi;
use App\Models\UserFeedback;
use App\Models\UserLikesBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $users = User::with(['likedBarangs', 'feedbacks', 'keranjangs'])
            ->latest()
            ->get();

        $barangs = Barang::with(['userLikes', 'feedbacks', 'keranjangs'])
            ->withCount(['userLikes as total_likes' => function ($query) {
                $query->where('liked', true);
            }])
            ->withAvg('feedbacks as average_rating', 'rating')
            ->get()
            ->map(function ($barang) {
                $barang->average_rating = $barang->average_rating ?? 0;
                $barang->harga_setelah_diskon = $barang->harga_jual - ($barang->harga_jual * $barang->diskon / 100);
                return $barang;
            });

        $keranjangs = Keranjang::with(['user', 'barang'])
            ->latest()
            ->get()
            ->map(function ($keranjang) {
                $keranjang->total_harga = $keranjang->barang->harga_setelah_diskon * $keranjang->jumlah;
                return $keranjang;
            });

        $notifikasis = Notifikasi::latest()
            ->take(20)
            ->get();

        $feedbacks = UserFeedback::with(['user', 'barang'])
            ->latest()
            ->get();

        $stats = [
            'total_users' => $users->where('role', 'user')->count(),
            'total_admins' => $users->where('role', 'admin')->count(),
            'total_products' => $barangs->count(),
            'displayed_products' => $barangs->where('display', true)->count(),
            'recommended_products' => $barangs->where('status_rekomendasi', true)->count(),
            'low_stock_products' => $barangs->where('stok', '<=', 10)->count(),
            'out_of_stock_products' => $barangs->where('stok', 0)->count(),
            'total_cart_items' => $keranjangs->count(),
            'total_cart_value' => $keranjangs->sum('total_harga'),
            'unread_notifications' => $notifikasis->where('dibaca', false)->count(),
            'total_feedbacks' => $feedbacks->count(),
            'average_rating' => $feedbacks->avg('rating') ?? 0,
            'total_likes' => UserLikesBarang::where('liked', true)->count(),
        ];

        $recentUsers = $users->where('role', 'user')
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        $popularProducts = $barangs->sortByDesc('total_likes')
            ->take(10)
            ->values();

        $lowStockProducts = $barangs->where('stok', '<=', 10)
            ->sortBy('stok')
            ->take(10)
            ->values();

        $recentNotifications = $notifikasis->take(10);

        $recentCartActivity = $keranjangs->take(10);

        $recentFeedbacks = $feedbacks->take(10);

        $monthlyUserRegistrations = $users->where('role', 'user')
            ->groupBy(function ($user) {
                return Carbon::parse($user->created_at)->format('Y-m');
            })
            ->map(function ($users) {
                return $users->count();
            })
            ->take(6);

        $categoryStats = $barangs->groupBy('kategori')
            ->map(function ($products) {
                return [
                    'count' => $products->count(),
                    'total_stock' => $products->sum('stok'),
                    'total_value' => $products->sum('harga_jual'),
                ];
            });

        $topRatedProducts = $barangs->where('average_rating', '>', 0)
            ->sortByDesc('average_rating')
            ->take(10)
            ->values();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'users' => $recentUsers,
            'barangs' => $barangs->take(50),
            'keranjangs' => $recentCartActivity,
            'notifikasis' => $recentNotifications,
            'feedbacks' => $recentFeedbacks,
            'popularProducts' => $popularProducts,
            'lowStockProducts' => $lowStockProducts,
            'topRatedProducts' => $topRatedProducts,
            'monthlyUserRegistrations' => $monthlyUserRegistrations,
            'categoryStats' => $categoryStats,
        ]);
    }

    public function getUsers()
    {
        $users = User::with(['likedBarangs', 'feedbacks', 'keranjangs'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function getBarangs()
    {
        $barangs = Barang::with(['userLikes', 'feedbacks'])
            ->withCount(['userLikes as total_likes' => function ($query) {
                $query->where('liked', true);
            }])
            ->withAvg('feedbacks as average_rating', 'rating')
            ->latest()
            ->paginate(20);

        $barangs->getCollection()->transform(function ($barang) {
            $barang->average_rating = $barang->average_rating ?? 0;
            $barang->harga_setelah_diskon = $barang->harga_jual - ($barang->harga_jual * $barang->diskon / 100);
            return $barang;
        });

        return response()->json([
            'success' => true,
            'data' => $barangs->items(),
            'pagination' => [
                'current_page' => $barangs->currentPage(),
                'last_page' => $barangs->lastPage(),
                'per_page' => $barangs->perPage(),
                'total' => $barangs->total(),
            ]
        ]);
    }

    public function getKeranjangs()
    {
        $keranjangs = Keranjang::with(['user', 'barang'])
            ->latest()
            ->paginate(20);

        $keranjangs->getCollection()->transform(function ($keranjang) {
            $keranjang->total_harga = $keranjang->barang->harga_setelah_diskon * $keranjang->jumlah;
            return $keranjang;
        });

        return response()->json([
            'success' => true,
            'data' => $keranjangs->items(),
            'pagination' => [
                'current_page' => $keranjangs->currentPage(),
                'last_page' => $keranjangs->lastPage(),
                'per_page' => $keranjangs->perPage(),
                'total' => $keranjangs->total(),
            ]
        ]);
    }

    public function getNotifikasis()
    {
        $notifikasis = Notifikasi::latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifikasis->items(),
            'pagination' => [
                'current_page' => $notifikasis->currentPage(),
                'last_page' => $notifikasis->lastPage(),
                'per_page' => $notifikasis->perPage(),
                'total' => $notifikasis->total(),
            ]
        ]);
    }

    public function getFeedbacks()
    {
        $feedbacks = UserFeedback::with(['user', 'barang'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $feedbacks->items(),
            'pagination' => [
                'current_page' => $feedbacks->currentPage(),
                'last_page' => $feedbacks->lastPage(),
                'per_page' => $feedbacks->perPage(),
                'total' => $feedbacks->total(),
            ]
        ]);
    }

    public function getStats()
    {
        $users = User::all();
        $barangs = Barang::withCount(['userLikes as total_likes' => function ($query) {
                $query->where('liked', true);
            }])
            ->withAvg('feedbacks as average_rating', 'rating')
            ->get();
        $keranjangs = Keranjang::with('barang')->get();
        $notifikasis = Notifikasi::all();
        $feedbacks = UserFeedback::all();

        $totalCartValue = $keranjangs->sum(function ($keranjang) {
            return ($keranjang->barang->harga_jual - ($keranjang->barang->harga_jual * $keranjang->barang->diskon / 100)) * $keranjang->jumlah;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $users->where('role', 'user')->count(),
                'total_admins' => $users->where('role', 'admin')->count(),
                'total_products' => $barangs->count(),
                'displayed_products' => $barangs->where('display', true)->count(),
                'recommended_products' => $barangs->where('status_rekomendasi', true)->count(),
                'low_stock_products' => $barangs->where('stok', '<=', 10)->count(),
                'out_of_stock_products' => $barangs->where('stok', 0)->count(),
                'total_cart_items' => $keranjangs->count(),
                'total_cart_value' => $totalCartValue,
                'unread_notifications' => $notifikasis->where('dibaca', false)->count(),
                'total_feedbacks' => $feedbacks->count(),
                'average_rating' => $feedbacks->avg('rating') ?? 0,
                'total_likes' => UserLikesBarang::where('liked', true)->count(),
            ]
        ]);
    }

    public function searchProducts(Request $request)
    {
        $query = $request->get('q', '');

        $barangs = Barang::where('nama_barang', 'like', "%{$query}%")
            ->orWhere('kode_barang', 'like', "%{$query}%")
            ->orWhere('kategori', 'like', "%{$query}%")
            ->orWhere('deskripsi', 'like', "%{$query}%")
            ->withCount(['userLikes as total_likes' => function ($query) {
                $query->where('liked', true);
            }])
            ->withAvg('feedbacks as average_rating', 'rating')
            ->paginate(20);

        $barangs->getCollection()->transform(function ($barang) {
            $barang->average_rating = $barang->average_rating ?? 0;
            $barang->harga_setelah_diskon = $barang->harga_jual - ($barang->harga_jual * $barang->diskon / 100);
            return $barang;
        });

        return response()->json([
            'success' => true,
            'data' => $barangs->items(),
            'pagination' => [
                'current_page' => $barangs->currentPage(),
                'last_page' => $barangs->lastPage(),
                'per_page' => $barangs->perPage(),
                'total' => $barangs->total(),
            ]
        ]);
    }
}
