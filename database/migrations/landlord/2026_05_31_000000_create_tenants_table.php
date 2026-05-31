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
        Schema::connection('landlord')->create('tenants', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // Unique tenant slug/id, e.g. 'toko-a'
            $table->string('name', 255);
            $table->string('domain', 255)->unique(); // e.g. 'tokoa.com' or 'tokoa.localhost'
            $table->string('db_host', 255);
            $table->string('db_port', 50)->default('3306');
            $table->string('db_database', 255);
            $table->string('db_username', 255);
            $table->string('db_password', 255)->nullable();
            $table->string('status', 50)->default('active'); // active, suspended
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('landlord')->dropIfExists('tenants');
    }
};
