<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserCreateResult extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'success' => isset($this->success) ? $this->success : null,
            'message' => isset($this->message) ? $this->message : null,
            'user' => [
                'id' => isset($this->user) && isset($this->user->id) && $this->user->id,
                'databaseId' => isset($this->user) && isset($this->user->databaseId) && $this->user->databaseId,
            ],
        ];
    }
}
