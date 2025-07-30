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
            self::STATUS_PENDING => 'default',
            self::STATUS_MENUNGGU_PEMBAYARAN => 'secondary',
            self::STATUS_DIBAYAR => 'blue',
            self::STATUS_DIPROSES => 'yellow',
            self::STATUS_SELESAI => 'green',
            self::STATUS_DIBATALKAN => 'destructive',
            default => 'default'
        };
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Menunggu',
            self::STATUS_MENUNGGU_PEMBAYARAN => 'Menunggu Pembayaran',
            self::STATUS_DIBAYAR => 'Sudah Dibayar',
            self::STATUS_DIPROSES => 'Sedang Diproses',
            self::STATUS_SELESAI => 'Selesai',
            self::STATUS_DIBATALKAN => 'Dibatalkan',
            default => 'Unknown'
        };
    }

    public function isExpired()
    {
        return $this->batas_pembayaran && Carbon::now()->gt($this->batas_pembayaran) && $this->status === self::STATUS_MENUNGGU_PEMBAYARAN;
    }

    public function canBePaid()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_MENUNGGU_PEMBAYARAN]) && !$this->isExpired();
    }

    public function canBeProcessed()
    {
        return $this->status === self::STATUS_DIBAYAR;
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeExpired($query)
    {
        return $query->where('batas_pembayaran', '<', Carbon::now())
                    ->where('status', self::STATUS_MENUNGGU_PEMBAYARAN);
    }
}
