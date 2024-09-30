<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
                'id'          => $this->id,
                'book_number' => $this->book_number,
                'description' => $this->description,
                'date'        => $this->created_at->diffForHumans(),
                'units_count' => $this->units_count,
                'units'       => UnitResource::collection($this->units)->resolve(),
        ];
    }
}
