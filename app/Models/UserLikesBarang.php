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

    // Remove the problematic boot method that prevents creation
    // The controller will handle the logic for creating/updating likes
}
