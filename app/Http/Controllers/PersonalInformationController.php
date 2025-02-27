<?php

namespace App\Http\Controllers;

use App\Models\PersonalInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PersonalInformationController extends Controller
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'title_before' =>'', 			  	  	
	 	    'title_after' =>'', 			  	  	
		    'date_of_birth' =>'required|date', 			  	  	
		    'nationality' =>'required', 			  	  	
	 	    'phone' =>'required|numeric|digits:10', 			  	  	
	 	    'email' =>'required|email', 			  	  	
	 	    'address' =>'required', 	 		  	  	
	 	    'city' =>'required', 			  	  	
	 	    'state' =>'required', 			  	  	
	 	    'zip' =>'required', 			  	  	
	 	    'country' =>'required', 			  	  	
	 	    'website' =>'nullable|url', 			  	  	
	 	    'summary' =>'required|string|max:300|min:10',
            'custom_fields' => 'nullable|json', 
        ]);
    
        $personalInformation = PersonalInformation::create([
            ...$validatedData,
            'user_id' => auth()->id(), 
            'custom_fields' => $validatedData['custom_fields'] ?? null, 
        ]);

        // redirect to the same route 
        // resume/{resume}/{sectionTemplateName}/create
        return redirect()->route('resume.sections.create', ['resume' => $personalInformation->resume_id, 'sectionTemplateName' => 'Personal Information'])->with('message', 'Personal Information created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(PersonalInformation $personalInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PersonalInformation $personalInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PersonalInformation $personalInformation)
    { 
        $validatedData = $request->validate([
            'resume_id' => 'required|exists:resumes,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'title_before' =>'nullable|string',
            'title_after' =>'nullable|string',
            'date_of_birth' =>'nullable|date', // Allow null/empty dates
            'nationality' =>'required|string',
            'phone' =>'required|numeric|digits:10',
            'email' =>'required|email',
            'address' =>'required|string',
            'city' =>'required|string',
            'state' =>'required|string',
            'zip' =>'required|string',
            'country' =>'required|string',
            'website' =>'nullable|url', // Allow null/empty website
            'summary' =>'nullable|string|max:300',
            'custom_fields' => 'nullable|json',
        ]);
    
        try {
            DB::beginTransaction();
    
            $personalInformation->resume_id = $validatedData['resume_id'];
            $personalInformation->user_id = Auth::id();
            $personalInformation->first_name = $validatedData['first_name'];
            $personalInformation->last_name = $validatedData['last_name'];
            $personalInformation->title_before = $validatedData['title_before'];
            $personalInformation->title_after = $validatedData['title_after'];
            $personalInformation->date_of_birth = $validatedData['date_of_birth'];  // Keep nullable
            $personalInformation->nationality = $validatedData['nationality'];
            $personalInformation->phone = $validatedData['phone'];
            $personalInformation->email = $validatedData['email'];
            $personalInformation->address = $validatedData['address'];
            $personalInformation->city = $validatedData['city'];
            $personalInformation->state = $validatedData['state'];
            $personalInformation->zip = $validatedData['zip'];
            $personalInformation->country = $validatedData['country'];
            $personalInformation->website = $validatedData['website']?? null;
            $personalInformation->summary = $validatedData['summary'];
            $personalInformation->custom_fields = $validatedData['custom_fields'];
    
            $personalInformation->save(); // Use the save method after manually assigning
            DB::commit();
    
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error("Error updating Personal Information: " . $e->getMessage());  // Log the full error
            return redirect()->back()->withErrors(['message' => 'Update failed.  Please see logs for details.']);  // Provide user-friendly error
        }
    
        return redirect()->back()->with('message', 'Personal Information updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PersonalInformation $personalInformation)
    {
        //
    }
}
