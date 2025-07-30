<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Jasa extends Model
{
    use HasFactory;

    protected $table = 'tb_jasa';

    protected $fillable = [
        'nama_jasa',
        'kode_jasa',
        'slug',
        'deskripsi',
        'foto',
        'snk',
        'harga',
        'display',
        'status_rekomendasi',
        'kategori',
    ];

    protected $casts = [
        'display' => 'boolean',
        'status_rekomendasi' => 'boolean',
        'harga' => 'decimal:2',
    ];

    // Auto generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($jasa) {
            if (empty($jasa->slug)) {
                $jasa->slug = static::generateUniqueSlug($jasa->nama_jasa);
            }
        });

        static::updating(function ($jasa) {
            if ($jasa->isDirty('nama_jasa') && empty($jasa->slug)) {
                $jasa->slug = static::generateUniqueSlug($jasa->nama_jasa, $jasa->id);
            }
        });
    }

    private static function generateUniqueSlug($name, $ignoreId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::slugExists($slug, $ignoreId)) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    private static function slugExists($slug, $ignoreId = null)
    {
        $query = static::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    // Relationships
    public function pekerja()
    {
        return $this->hasMany(Pekerja::class, 'jasa_id');
    }

    // Scopes
    public function scopeDisplayed($query)
    {
        return $query->where('display', true);
    }

    public function scopeRecommended($query)
    {
        return $query->where('status_rekomendasi', true);
    }
}
