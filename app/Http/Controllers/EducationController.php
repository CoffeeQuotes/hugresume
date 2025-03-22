<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'resume_id' => 'required|exists:resumes,id', 
            'institution_name' => 'required|string|max:150',	
            'field_of_study' => 'nullable|string|max:150',	
            'degree' => 'required|string|max:100',	
            'city' => 'required|string|max:100',	
            'country' => 'required|string|max:100',	
            'started' => 'required|date',	
            'ended' => 'nullable|date',	
            'description' => 'nullable',
        ]);
    
        $education = Education::create([
            ...$validatedData,
            'user_id' => auth()->id(),
        ]);

        // redirect to the same route 
        // resume/{resume}/{sectionTemplateName}/create
        return redirect()->route('resume.sections.create', ['resume' => $education->resume_id, 'sectionTemplateName' => 'Education'])->with('message', 'Education created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Education $education)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Education $education)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Education $education)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Education $education)
    {
        //
    }
}
