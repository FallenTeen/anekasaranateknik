<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'tb_notifikasi';

    protected $fillable = [
        'type',
        'judul',
        'pesan',
        'data',
        'dibaca',
    ];

    protected $casts = [
        'data' => 'array',
        'dibaca' => 'boolean',
    ];

    // Constants for notification types
    const TYPE_USER_REGISTERED = 'user_registered';
    const TYPE_ITEM_LIKED = 'item_liked';
    const TYPE_ITEM_MASUK_KERANJANG = 'item_masuk_keranjang';
    const TYPE_PAYMENT_SELESAI = 'payment_selesai';

    // Helper methods
    public function markAsRead()
    {
        $this->update(['dibaca' => true]);
    }

    public function scopeUnread($query)
    {
        return $query->where('dibaca', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Factory methods for different notification types
    public static function createUserRegisteredNotification($user)
    {
        return self::create([
            'type' => self::TYPE_USER_REGISTERED,
            'judul' => 'User Baru Terdaftar',
            'pesan' => "User baru {$user->name} telah mendaftar di sistem",
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
            ],
        ]);
    }

    public static function createItemLikedNotification($user, $barang)
    {
        return self::create([
            'type' => self::TYPE_ITEM_LIKED,
            'judul' => 'Item Disukai',
            'pesan' => "{$user->name} menyukai {$barang->nama_barang}",
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'barang_id' => $barang->id,
                'barang_name' => $barang->nama_barang,
            ],
        ]);
    }

    public static function createItemAddedToCartNotification($user, $barang, $jumlah = 1)
    {
        return self::create([
            'type' => self::TYPE_ITEM_MASUK_KERANJANG,
            'judul' => 'Item Masuk Keranjang',
            'pesan' => "{$user->name} menambahkan {$jumlah} {$barang->nama_barang} ke keranjang",
            'data' => [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'barang_id' => $barang->id,
                'barang_name' => $barang->nama_barang,
                'jumlah' => $jumlah,
            ],
        ]);
    }
}
