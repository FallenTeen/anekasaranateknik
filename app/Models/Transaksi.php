<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'tb_transaksi';

    protected $fillable = [
        'kode_transaksi',
        'user_id',
        'items',
        'total_harga',
        'diskon_total',
        'total_bayar',
        'status',
        'metode_pembayaran',
        'bukti_pembayaran',
        'catatan_admin',
        'alamat_pengiriman',
        'batas_pembayaran',
        'dibayar_pada',
        'diproses_pada',
        'selesai_pada',
    ];

    protected $casts = [
        'items' => 'array',
        'total_harga' => 'decimal:2',
        'diskon_total' => 'decimal:2',
        'total_bayar' => 'decimal:2',
        'batas_pembayaran' => 'datetime',
        'dibayar_pada' => 'datetime',
        'diproses_pada' => 'datetime',
        'selesai_pada' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_MENUNGGU_PEMBAYARAN = 'menunggu_pembayaran';
    const STATUS_DIBAYAR = 'dibayar';
    const STATUS_DIPROSES = 'diproses';
    const STATUS_SELESAI = 'selesai';
    const STATUS_DIBATALKAN = 'dibatalkan';

    public static function boot()
    {
        parent::boot();

        static::creating(function ($transaksi) {
            if (empty($transaksi->kode_transaksi)) {
                $transaksi->kode_transaksi = 'TRX-' . strtoupper(uniqid());
            }

            if (empty($transaksi->batas_pembayaran)) {
                $transaksi->batas_pembayaran = Carbon::now()->addHours(24);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getStatusBadgeColorAttribute()
    {
        return match($this->status) {
            'pending' => 'default',
            'menunggu_pembayaran' => 'secondary',
            'dibayar' => 'blue',
            'diproses' => 'yellow',
            'selesai' => 'green',
            'dibatalkan' => 'destructive',
            default => 'default'
        };
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'pending' => 'Menunggu',
            'menunggu_pembayaran' => 'Menunggu Pembayaran',
            'dibayar' => 'Sudah Dibayar',
            'diproses' => 'Sedang Diproses',
            'selesai' => 'Selesai',
            'dibatalkan' => 'Dibatalkan',
            default => 'Unknown'
        };
    }

    public function isExpired()
    {
        return $this->batas_pembayaran && Carbon::now()->gt($this->batas_pembayaran) && $this->status === 'menunggu_pembayaran';
    }

    public function canBePaid()
    {
        return in_array($this->status, ['pending', 'menunggu_pembayaran']) && !$this->isExpired();
    }

    public function canBeProcessed()
    {
        return $this->status === 'dibayar';
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeExpired($query)
    {
        return $query->where('batas_pembayaran', '<', Carbon::now())
                    ->where('status', 'menunggu_pembayaran');
    }
}
