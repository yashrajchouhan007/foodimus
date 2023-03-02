<?php

declare(strict_types=1);

namespace App\Console\Commands\Stripe;

use Illuminate\Console\Command;
use Stripe\Plan;

class PlansList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stripe:plans:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all current Stripe plans';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $plans = Plan::all()->data;
        $columns = ['active', 'id', 'product', 'amount', 'currency', 'nickname', 'billing_scheme', 'usage_type'];
        $data = array_map(function ($plan) use ($columns) {
            // Extract all columns from each object
            return array_map(fn ($column) => $plan[$column], $columns);
        }, $plans);

        $this->table($columns, $data);

        return 0;
    }
}
