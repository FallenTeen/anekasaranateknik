<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFeedback extends Model
{
    use HasFactory;

    protected $table = 'tb_user_feedbacks';

    protected $fillable = [
        'user_id',
        'barang_id',
        'feedback',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
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

    // Validation
    public static function boot()
    {
        parent::boot();

        static::saving(function ($feedback) {
            // Ensure rating is between 1-5
            if ($feedback->rating && ($feedback->rating < 1 || $feedback->rating > 5)) {
                throw new \InvalidArgumentException('Rating must be between 1 and 5');
            }
        });
    }
}
