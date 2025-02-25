<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    //
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'template',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
