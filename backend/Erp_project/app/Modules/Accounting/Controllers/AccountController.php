<?php

namespace App\Modules\Accounting\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Accounting\Models\Account;

class AccountController extends Controller
{
    public function index()
    {
        // only return accounts belonging to the authenticated user's company
        $accounts = Account::all();
        
        return response()->json($accounts);
    }
    
    public function store(Request $request)
    {
        // The company_id will be automatically set by the BelongsToTenant trait
        $account = Account::create([
            'code' => $request->code,
            'name' => $request->name,
            'type' => $request->type
        ]);
        
        return response()->json($account, 201);
    }
}