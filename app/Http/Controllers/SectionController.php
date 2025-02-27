<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Resume;
use App\Models\PersonalInformation;

class SectionController extends Controller
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
    public function create(Request $request, Resume $resume)
    {
        // We will render Inertia template based upon 
        // the section template name
        $sectionTemplateName = $request->route('sectionTemplateName');
        $sectionTemplateName = str_replace(' ', '', $sectionTemplateName);
        $sectionTemplateName = ucfirst($sectionTemplateName);
        $sectionTemplateName = str_replace(' ', '', $sectionTemplateName);
        // We will fetch the resume sections Model (ex. PersonalInformation ) based upon the resume id
        if($sectionTemplateName == 'PersonalInformation'){
            $personalInformation = PersonalInformation::where('resume_id', $resume->id)->first();
        }
        return Inertia::render('resume/section/'.$sectionTemplateName, [
            'resume' => $resume,
            // If the section is PersonalInformation, we will pass the personal information model
            'personalInformation' => $personalInformation ?? null,
        ]); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 'resume/{resume}/{sectionTemplateName}
        // id 	resume_id 	name 	content 	form_template 	order 	created_at 	updated_at 	
        $resumeId = $request->route('resume');
        $sectionTemplateName = $request->route('sectionTemplateName');
        $section = new Section();
        $section->resume_id = $resumeId;
        $section->name = $sectionTemplateName;
        $section->content = $sectionTemplateName;
        $section->form_template = $sectionTemplateName;
        $section->order = 0;
        $section->save();
        return to_route('resume.sections', $resumeId)->with('message', 'Section created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Section $section)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        //
    }
}
