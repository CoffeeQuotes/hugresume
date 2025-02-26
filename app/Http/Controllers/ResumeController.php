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
    public function index(Request $request)
    {
        $query = Resume::where('user_id', auth()->user()->id);
        
        // Apply title filter if provided
        if ($request->has('title') && !empty($request->title)) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }
        
        // Apply template filter if provided
        if ($request->has('template') && !empty($request->template)) {
            $query->where('template', $request->template);
        }
        
        // Apply date filter if provided
        if ($request->has('date_filter') && !empty($request->date_filter)) {
            if ($request->date_filter === 'newest') {
                $query->orderBy('created_at', 'desc');
            } elseif ($request->date_filter === 'oldest') {
                $query->orderBy('created_at', 'asc');
            } elseif ($request->date_filter === 'recently_updated') {
                $query->orderBy('updated_at', 'desc');
            }
        } else {
            // Default sort by most recent
            $query->orderBy('created_at', 'desc');
        }
        
        // Paginate results - 9 per page (3x3 grid)
        $resumes = $query->paginate(9)->through(function ($resume) {
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
        
        // Get unique templates for filter dropdown
        $templates = Resume::where('user_id', auth()->user()->id)
            ->select('template')
            ->distinct()
            ->pluck('template');
        
        return Inertia::render('resume/resumeshome', [
            'resumes' => $resumes,
            'filters' => $request->only(['title', 'template', 'date_filter']),
            'templates' => $templates
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        # get all templates
        $templates = [
            ['id' => 1, 'name' => 'template1'],
            ['id' => 2, 'name' => 'template2'],
            ['id' => 3, 'name' => 'template3'],
            ['id' => 4, 'name' => 'template4'],
            ['id' => 5, 'name' => 'template5'],
            ['id' => 6, 'name' => 'template6'],
            ['id' => 7, 'name' => 'template7'],
            ['id' => 8, 'name' => 'template8'],
            ['id' => 9, 'name' => 'template9'],
            ['id' => 10, 'name' => 'template10'],
        ];
        
        return Inertia::render('resume/resumeform', [
            'templates' => $templates
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'title' => 'required|max:255|unique:resumes,title',
            'description' => 'required|min:10|max:255',
            'template' => 'required',
        ]);
        $resume = new Resume();
        $resume->title = $request->title;
        $resume->description = $request->description;
        $resume->template = $request->template;
        $resume->user_id = auth()->user()->id;
        $resume->save();
        return to_route('resume.edit', $resume->id)->with('message', 'Resume created successfully');
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
    {   $templates = [
        ['id' => 1, 'name' => 'template1'],
        ['id' => 2, 'name' => 'template2'],
        ['id' => 3, 'name' => 'template3'],
        ['id' => 4, 'name' => 'template4'],
        ['id' => 5, 'name' => 'template5'],
        ['id' => 6, 'name' => 'template6'],
        ['id' => 7, 'name' => 'template7'],
        ['id' => 8, 'name' => 'template8'],
        ['id' => 9, 'name' => 'template9'],
        ['id' => 10, 'name' => 'template10'],
    ];
        return Inertia::render('resume/resumeform', [
           'resume' => $resume,
           'templates' => $templates
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resume $resume)
    {
        //
        $request->validate([
            'title' =>'required|max:255',
            'description' =>'required|min:10|max:255',
            'template' =>'required',
        ]);
        $resume->title = $request->title;
        $resume->description = $request->description;
        $resume->template = $request->template;
        $resume->user_id = auth()->user()->id;
        $resume->save();
        return to_route('resume.edit', $resume->id)->with('message', 'Resume updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resume $resume)
    {
        //
    }
}
