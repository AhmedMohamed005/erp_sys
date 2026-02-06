<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('journal_entry_lines', function (Blueprint $table) {
            // Add company_id column
            $table->unsignedBigInteger('company_id')->nullable();
        });
        
        // Populate company_id from related journal_entries
        if (Schema::hasTable('journal_entry_lines') && Schema::hasTable('journal_entries')) {
            \DB::statement('UPDATE journal_entry_lines SET company_id = journal_entries.company_id FROM journal_entries WHERE journal_entry_lines.entry_id = journal_entries.id');
        }
        
        // Add foreign key constraint
        Schema::table('journal_entry_lines', function (Blueprint $table) {
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->index('company_id'); // Add index for performance
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('journal_entry_lines', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
    }
};
