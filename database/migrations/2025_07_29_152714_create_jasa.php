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
        Schema::create('tb_jasa', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jasa');
            $table->string('kode_jasa')->unique();
            $table->string('slug')->unique()->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('foto')->nullable();
            $table->text('snk')->nullable();
            $table->decimal('harga', 15, 2)->default(0.00);
            $table->boolean('display')->default(true);
            $table->boolean('status_rekomendasi')->default(false);
            $table->string('kategori')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jasa');
    }
};
