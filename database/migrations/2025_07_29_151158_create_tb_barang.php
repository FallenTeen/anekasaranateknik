<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_barang', function (Blueprint $table) {
            $table->id();
            $table->string('nama_barang');
            $table->string('kode_barang')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('gambar')->nullable();
            $table->json('gambar_deskripsi')->nullable();
            // Inihhh buat fitur untuk menampilkan barang di frontend
            // Jika display true, maka barang akan ditampilkan di frontend vice versa
            $table->boolean('display')->default(true);
            // Jika display true, maka barang akan direkomendasikan di frontend
            $table->boolean('status_rekomendasi')->default(false);

            $table->string('stok')->default('0');
            $table->string('slug')->unique()->nullable();
            $table->decimal('harga_beli', 15, 2)->default(0.00);
            $table->decimal('harga_jual', 15, 2)->default(0.00);
            $table->decimal('diskon', 5, 2)->default(0.00);

            $table->string('kategori')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_barang');
    }
};
