<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLikesBarang extends Model
{
    use HasFactory;

    protected $table = 'tb_user_likes_barang';

    protected $fillable = [
        'user_id',
        'barang_id',
        'liked',
    ];

    protected $casts = [
        'liked' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    // Prevent duplicate likes
    public static function boot()
    {
        parent::boot();

        static::creating(function ($userLike) {
            // Check if user already liked this item
            $existing = self::where('user_id', $userLike->user_id)
                          ->where('barang_id', $userLike->barang_id)
                          ->first();

            if ($existing) {
                // Update existing record instead of creating new one
                $existing->update(['liked' => $userLike->liked]);
                return false; // Prevent creation
            }
        });
    }
}
