<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class ResumeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get data from resume model where user_id is current logged in user
        $resumes = Resume::where('user_id', auth()->user()->id)->get()->map(function ($resume) {
            return [
                'id' => $resume->id,
                'user_id' => $resume->user_id,
                'title' => $resume->title, 
                'description' => $resume->description,
                'template' => $resume->template,
                'created_at' => $resume->created_at->diffForHumans(),
                'updated_at' => $resume->updated_at->diffForHumans(),
            ];
        });
        
        return Inertia::render('resume/resumeshome', [
            'resumes' => $resumes
        ]);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('resume/resumecreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Resume $resume)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resume $resume)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resume $resume)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resume $resume)
    {
        //
    }
}
