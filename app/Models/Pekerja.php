<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pekerja extends Model
{
    use HasFactory;

    protected $table = 'tb_pekerja';

    protected $fillable = [
        'nama_pekerja',
        'email',
        'telepon',
        'alamat',
        'jabatan',
        'spesialis',
        'status',
        'busy_mulai',
        'busy_selesai',
        'foto',
        'slug',
        'deskripsi',
        'display',
        'jasa_id',
    ];

    protected $casts = [
        'display' => 'boolean',
        'busy_mulai' => 'date',
        'busy_selesai' => 'date',
    ];

    // Status constants
    const STATUS_STANDBY = 'standby';
    const STATUS_OFF = 'off';
    const STATUS_BUSY = 'busy';

    // Relationships
    public function jasa()
    {
        return $this->belongsTo(Jasa::class, 'jasa_id');
    }

    // Helper methods
    public function isAvailable()
    {
        if ($this->status === self::STATUS_BUSY) {
            // Check if current time is within busy period
            $now = now();
            return !($this->busy_mulai && $this->busy_selesai &&
                    $now >= $this->busy_mulai && $now <= $this->busy_selesai);
        }
        return $this->status === self::STATUS_STANDBY;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            self::STATUS_STANDBY => 'green',
            self::STATUS_BUSY => 'yellow',
            self::STATUS_OFF => 'gray',
            default => 'gray'
        };
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            self::STATUS_STANDBY => 'Standby',
            self::STATUS_BUSY => 'Sibuk',
            self::STATUS_OFF => 'Off',
            default => 'Unknown'
        };
    }
}
