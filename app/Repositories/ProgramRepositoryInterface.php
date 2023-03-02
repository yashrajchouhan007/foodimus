<?php

declare(strict_types=1);

namespace App\Repositories;

interface ProgramRepositoryInterface
{
    public function get($id): \App\Http\Resources\Program;

    public function list($start = 0, $count = 50): \App\Http\Resources\Programs;
}
