<?php

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\KeranjangController;
use App\Http\Controllers\User\PesananController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:user'])->prefix('user')->name('user.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/keranjang', [KeranjangController::class, 'index'])->name('keranjang');
    Route::post('/keranjang/add', [KeranjangController::class, 'add'])->name('keranjang.add');
    Route::put('/keranjang/{id}', [KeranjangController::class, 'update'])->name('keranjang.update');
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'remove'])->name('keranjang.remove');
    Route::post('/keranjang/checkout', [KeranjangController::class, 'checkout'])->name('keranjang.checkout');
    Route::delete('/keranjang/clear', [KeranjangController::class, 'clear'])->name('keranjang.clear');

    Route::get('/riwayat-pesanan', [PesananController::class, 'index'])->name('riwayat-pesanan');
    Route::get('/riwayat-pesanan/{id}', [PesananController::class, 'show'])->name('riwayat-pesanan.show');
    Route::post('/riwayat-pesanan/{id}/cancel', [PesananController::class, 'cancel'])->name('riwayat-pesanan.cancel');
    Route::post('/riwayat-pesanan/{id}/review', [PesananController::class, 'review'])->name('riwayat-pesanan.review');
});
