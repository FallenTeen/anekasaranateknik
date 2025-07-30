<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\CartController;
use App\Http\Controllers\Public\TransactionController;
use App\Models\Barang;

Route::get('/', function () {
    $recommendedProducts = Barang::where('display', true)
        ->where('status_rekomendasi', true)
        ->withCount(['userLikes as total_likes', 'feedbacks'])
        ->with([
            'feedbacks' => function ($query) {
                $query->select('barang_id', 'rating');
            }
        ])
        ->limit(8)
        ->get()
        ->map(function ($item) {
            $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
            $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
            unset($item->feedbacks);
            return $item;
        });

    $categoriesWithProducts = Barang::where('display', true)
        ->whereNotNull('kategori')
        ->select('kategori')
        ->distinct()
        ->pluck('kategori')
        ->take(3)
        ->map(function ($kategori) {
            $products = Barang::where('display', true)
                ->where('kategori', $kategori)
                ->withCount(['userLikes as total_likes', 'feedbacks'])
                ->with([
                    'feedbacks' => function ($query) {
                        $query->select('barang_id', 'rating');
                    }
                ])
                ->limit(3)
                ->get()
                ->map(function ($item) {
                    $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                    $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                    unset($item->feedbacks);
                    return $item;
                });

            return [
                'category' => [
                    'nama_kategori' => $kategori,
                    'deskripsi' => 'Produk ' . $kategori . ' terbaik'
                ],
                'topItems' => $products
            ];
        });

    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'recommendedProducts' => $recommendedProducts,
        'categoriesWithProducts' => $categoriesWithProducts,
    ]);
})->name('welcome');

Route::middleware('auth')->get('/user', function () {
    return response()->json(auth()->user());
})->name('api.user');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    } else {
        return redirect()->route('user.dashboard');
    }
})->name('dashboard');

Route::prefix('public')->name('public.')->group(function () {

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
    Route::get('/products/category/{kategori}', [ProductController::class, 'byCategory'])->name('products.category');

    Route::get('/products/navbar', [ProductController::class, 'getNavbarProducts'])->name('products.navbar');
    Route::get('/products/favorites', [ProductController::class, 'getCurrentUserFavorites'])->name('products.favorites');
    Route::get('/products/liked', [ProductController::class, 'getLikedProducts'])->middleware('auth')->name('products.liked');
    Route::post('/products/toggle-favorite', [ProductController::class, 'toggleFavorite'])->middleware('auth')->name('products.toggle-favorite');

    Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::get('/cart/count', [CartController::class, 'getCount'])->name('cart.count');

    Route::middleware('auth')->group(function () {
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::put('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
        Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

        Route::get('/checkout', [TransactionController::class, 'checkout'])->name('transaction.checkout');
        Route::post('/checkout', [TransactionController::class, 'store'])->name('transaction.store');
        Route::post('/payment/{id}/upload', [TransactionController::class, 'uploadPaymentProof'])->name('transaction.upload-payment');
        Route::get('/payment/{id}', [TransactionController::class, 'payment'])->name('transaction.payment');
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transaction.index');
        Route::post('/transactions/{id}/cancel', [TransactionController::class, 'cancel'])->name('transaction.cancel');
        Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('transaction.show');
     
    });
});

require __DIR__ . '/admin.php';
require __DIR__ . '/user.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';