<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    use HasFactory;

    protected $table = 'tb_keranjang';

    protected $fillable = [
        'user_id',
        'barang_id',
        'jumlah',
    ];

    protected $casts = [
        'jumlah' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id');
    }

    // Helper methods
    public function getTotalHargaAttribute()
    {
        return $this->barang->harga_setelah_diskon * $this->jumlah;
    }
    public function getQuantityAttribute()
    {
        return $this->jumlah;
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function ($keranjang) {
            if ($keranjang->jumlah <= 0) {
                throw new \InvalidArgumentException('Jumlah harus lebih dari 0');
            }
        });

    }
}