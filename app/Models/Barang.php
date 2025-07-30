<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Barang extends Model
{
    use HasFactory;

    protected $table = 'tb_barang';

    protected $fillable = [
        'nama_barang',
        'kode_barang',
        'deskripsi',
        'gambar',
        'gambar_deskripsi',
        'display',
        'status_rekomendasi',
        'stok',
        'slug',
        'harga_beli',
        'harga_jual',
        'diskon',
        'kategori',
    ];

    protected $casts = [
        'display' => 'boolean',
        'gambar_deskripsi' => 'json',
        'status_rekomendasi' => 'boolean',
        'harga_beli' => 'decimal:2',
        'harga_jual' => 'decimal:2',
        'diskon' => 'decimal:2',
    ];

    // Auto generate unique slug
    public static function boot()
    {
        parent::boot();

        static::creating(function ($barang) {
            if (empty($barang->slug)) {
                $barang->slug = static::generateUniqueSlug($barang->nama_barang);
            }
        });

        static::updating(function ($barang) {
            if ($barang->isDirty('nama_barang') && empty($barang->slug)) {
                $barang->slug = static::generateUniqueSlug($barang->nama_barang, $barang->id);
            }
        });
    }

    /**
     * Generate unique slug from string
     */
    private static function generateUniqueSlug($string, $ignoreId = null)
    {
        $originalSlug = Str::slug($string);
        $slug = $originalSlug;
        $counter = 1;

        // Keep checking until we find a unique slug
        while (static::slugExists($slug, $ignoreId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if slug exists in database
     */
    private static function slugExists($slug, $ignoreId = null)
    {
        $query = static::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    // Relationships
    public function userLikes()
    {
        return $this->hasMany(UserLikesBarang::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(UserFeedback::class);
    }

    public function keranjangs()
    {
        return $this->hasMany(Keranjang::class, 'id_barang');
    }

    // Helper methods
    public function getHargaSetelahDiskonAttribute()
    {
        return $this->harga_jual - ($this->harga_jual * $this->diskon / 100);
    }

    public function isLikedByUser($userId)
    {
        return $this->userLikes()->where('user_id', $userId)->where('liked', true)->exists();
    }

    public function getTotalLikesAttribute()
    {
        return $this->userLikes()->where('liked', true)->count();
    }

    public function getAverageRatingAttribute()
    {
        return $this->feedbacks()->avg('rating') ?? 0;
    }

    public function scopeDisplayed($query)
    {
        return $query->where('display', true);
    }

    public function scopeRecommended($query)
    {
        return $query->where('status_rekomendasi', true);
    }
}
