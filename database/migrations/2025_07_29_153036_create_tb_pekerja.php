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
        Schema::create('tb_pekerja', function (Blueprint $table) {
            $table->id();
              $table->string('nama_pekerja');
            $table->string('email')->unique();
            $table->string('telepon')->nullable();
            $table->string('alamat')->nullable();
            $table->string('jabatan')->nullable();
            $table->string('spesialis')->nullable();
            $table->enum('status', ['standby','off','busy'])->default('standby');
            $table->date('busy_mulai')->nullable();
            $table->date('busy_selesai')->nullable();
            $table->string('foto')->nullable();
            $table->string('slug')->unique()->nullable();
            $table->text('deskripsi')->nullable();
            $table->boolean('display')->default(true);
            $table->unsignedBigInteger('jasa_id')->nullable();
            $table->timestamps();

            $table->foreign('jasa_id')->references('id')->on('tb_jasa')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_pekerja');
    }
};
