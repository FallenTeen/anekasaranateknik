<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\CartController;
use App\Models\Barang;

Route::get('/', function () {
    $recommendedProducts = Barang::where('display', true)
        ->where('status_rekomendasi', true)
        ->withCount(['userLikes as total_likes', 'feedbacks'])
        ->with(['feedbacks' => function ($query) {
            $query->select('barang_id', 'rating');
        }])
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
                ->with(['feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }])
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
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
    
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
});

require __DIR__.'/admin.php';
require __DIR__.'/user.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
