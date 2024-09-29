<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExampleTranslateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
                'id'        => $this->id,
                'word_id'   => $this->pivot->word_id,
                'translate' => $this->pivot->translate,
                'date' => $this->pivot->created_at->diffForHumans()
        ];
    }
}
