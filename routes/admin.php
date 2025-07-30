<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProdukController;
use App\Http\Controllers\Admin\TransaksiController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\PekerjaController;
use App\Http\Controllers\Admin\NotifikasiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('produk')->name('produk.')->group(function () {

        Route::get('/kelola', [ProdukController::class, 'index'])->name('kelola');
        Route::get('/kelola/create', [ProdukController::class, 'create'])->name('kelola.create');
        Route::post('/kelola', [ProdukController::class, 'store'])->name('kelola.store');
        Route::get('/kelola/{id}/edit', [ProdukController::class, 'edit'])->name('kelola.edit');
        Route::put('/kelola/{id}', [ProdukController::class, 'update'])->name('kelola.update');
        Route::delete('/kelola/{id}', [ProdukController::class, 'destroy'])->name('kelola.destroy');
        Route::get('/kelola/{id}', [ProdukController::class, 'show'])->name('kelola.show');
        Route::patch('/produk/{id}/toggle-display', [ProdukController::class, 'toggleDisplay'])
            ->name('kelola.toggle-display');

        Route::patch('/produk/{id}/toggle-rekomendasi', [ProdukController::class, 'toggleRecommendation'])
            ->name('kelola.toggle-rekomendasi');

        Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi');
        Route::get('/transaksi/{id}', [TransaksiController::class, 'show'])->name('transaksi.show');
        Route::put('/transaksi/{id}/status', [TransaksiController::class, 'updateStatus'])->name('transaksi.status');

        Route::get('/riwayat', [TransaksiController::class, 'riwayat'])->name('riwayat');
        Route::get('/riwayat/export', [TransaksiController::class, 'export'])->name('riwayat.export');
    });

    Route::prefix('services')->name('services.')->group(function () {

        Route::get('/jasa', [ServiceController::class, 'index'])->name('jasa');
        Route::get('/jasa/create', [ServiceController::class, 'create'])->name('jasa.create');
        Route::post('/jasa', [ServiceController::class, 'store'])->name('jasa.store');
        Route::get('/jasa/{id}/edit', [ServiceController::class, 'edit'])->name('jasa.edit');
        Route::put('/jasa/{id}', [ServiceController::class, 'update'])->name('jasa.update');
        Route::delete('/jasa/{id}', [ServiceController::class, 'destroy'])->name('jasa.destroy');
        Route::get('/jasa/{id}', [ServiceController::class, 'show'])->name('jasa.show');

        Route::get('/pekerja', [PekerjaController::class, 'index'])->name('pekerja');
        Route::get('/pekerja/create', [PekerjaController::class, 'create'])->name('pekerja.create');
        Route::post('/pekerja', [PekerjaController::class, 'store'])->name('pekerja.store');
        Route::get('/pekerja/{id}/edit', [PekerjaController::class, 'edit'])->name('pekerja.edit');
        Route::put('/pekerja/{id}', [PekerjaController::class, 'update'])->name('pekerja.update');
        Route::delete('/pekerja/{id}', [PekerjaController::class, 'destroy'])->name('pekerja.destroy');
        Route::put('/pekerja/{id}/status', [PekerjaController::class, 'updateStatus'])->name('pekerja.status');
    });

    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi');
    Route::post('/notifikasi', [NotifikasiController::class, 'store'])->name('notifikasi.store');
    Route::put('/notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.markAsRead');
    Route::delete('/notifikasi/{id}', [NotifikasiController::class, 'destroy'])->name('notifikasi.destroy');
    Route::post('/notifikasi/broadcast', [NotifikasiController::class, 'broadcast'])->name('notifikasi.broadcast');
});
