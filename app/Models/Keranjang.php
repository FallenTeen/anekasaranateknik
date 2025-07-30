<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    use HasFactory;

    protected $table = 'tb_keranjang';

    protected $fillable = [
        'id_user',
        'id_barang',
        'jumlah',
    ];

    protected $casts = [
        'jumlah' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    // Helper methods
    public function getTotalHargaAttribute()
    {
        return $this->barang->harga_setelah_diskon * $this->jumlah;
    }

    // Validation and business logic
    public static function boot()
    {
        parent::boot();

        static::saving(function ($keranjang) {
            // Ensure quantity is positive
            if ($keranjang->jumlah <= 0) {
                throw new \InvalidArgumentException('Jumlah harus lebih dari 0');
            }
        });

        static::creating(function ($keranjang) {
            // Check if item already exists in cart
            $existing = self::where('id_user', $keranjang->id_user)
                          ->where('id_barang', $keranjang->id_barang)
                          ->first();

            if ($existing) {
                // Update quantity instead of creating new record
                $existing->increment('jumlah', $keranjang->jumlah);
                return false; // Prevent creation
            }
        });
    }
}
