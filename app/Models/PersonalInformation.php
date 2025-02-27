<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalInformation extends Model
{
    //
    protected $fillable = [
        'resume_id',
        'user_id',
        'first_name',
        'last_name',
        'title_before',
        'title_after',
        'date_of_birth',
        'nationality',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'website',
        'summary',
        'custom_fields',
    ];

}
