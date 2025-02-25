<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResumeController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('resume', [ResumeController::class, 'index'])->name('resume');
    // Create resume 
    Route::get('resume/create', [ResumeController::class, 'create'])->name('resume.create');
    Route::get('resume/{resume}', [ResumeController::class, 'show'])->name('resume.show');
    Route::get('resume/{resume}/edit', [ResumeController::class, 'edit'])->name('resume.edit');
    Route::put('resume/{resume}', [ResumeController::class, 'update'])->name('resume.update');
    Route::post('resume', [ResumeController::class, 'store'])->name('resume.store');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
