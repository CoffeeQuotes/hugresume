<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResumeController, App\Http\Controllers\SectionController, App\Http\Controllers\PersonalInformationController, App\Http\Controllers\EducationController;

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

    // Section routes
    # add section 

    Route::get('resume/{resume}/sections', [ResumeController::class,'sections'])->name('resume.sections');
    Route::get('resume/{resume}/{sectionTemplateName}', [SectionController::class, 'store'])->name('resume.sections.store');
    Route::get('resume/{resume}/{sectionTemplateName}/create', [SectionController::class,'create'])->name('resume.sections.create');

    // personal-information.store
    Route::post('personal-information/{resume}/store', [PersonalInformationController::class,'store'])->name('personal-information.store');
    // personal-information.update
    Route::put('personal-information/{personalInformation}', [PersonalInformationController::class,'update'])->name('personal-information.update');

    // education 
    Route::post('education/{resume}/store', [EducationController::class, 'store'])->name('education.store');
    
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
