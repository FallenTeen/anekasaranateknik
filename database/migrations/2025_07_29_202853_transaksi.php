<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_transaksi', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('items');
            $table->decimal('total_harga', 15, 2);
            $table->decimal('diskon_total', 15, 2)->default(0.00);
            $table->decimal('total_bayar', 15, 2);
            $table->enum('status', ['pending', 'menunggu_pembayaran', 'dibayar', 'diproses', 'selesai', 'dibatalkan'])->default('pending');
            $table->enum('metode_pembayaran', ['transfer_bank', 'e_wallet', 'cod'])->nullable();
            $table->string('bukti_pembayaran')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->text('alamat_pengiriman')->nullable();
            $table->timestamp('batas_pembayaran')->nullable();
            $table->timestamp('dibayar_pada')->nullable();
            $table->timestamp('diproses_pada')->nullable();
            $table->timestamp('selesai_pada')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_transaksi');
    }
};
