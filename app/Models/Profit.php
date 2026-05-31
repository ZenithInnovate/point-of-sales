<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profit extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'transaction_id', 'total',
    ];

    /**
     * transaction
     *
     * @return void
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * createdAt
     */
    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn (\DateTimeInterface|\Carbon\WeekDay|\Carbon\Month|string|int|float|null $value): string => Carbon::parse($value)->format('d-M-Y H:i:s'),
        );
    }
}
