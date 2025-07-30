<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_notifikasi', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'user_registered', 'payment_selesai', 'item_liked', 'item_masuk_keranjang'
            $table->string('judul')->nullable();
            $table->text('pesan')->nullable();
            $table->json('data')->nullable(); // data notif (user_id, product_id, etc.)
            $table->boolean('dibaca')->default(false); // status notifikasi sudah dibaca atau belum
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_notifikasi');
    }
};
