<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WordResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $WordStatistic = $this->userWordStatistics->first();
        $statistic = !$WordStatistic ? null : (new WordStatisticResource($WordStatistic))->resolve();

        return [
                'id'                   => $this->id,
                'word_hash'            => $this->word_hash,
                'name'                 => $this->name,
                'transcription'        => $this->transcription,
                'definition'           => $this->definition,
                'example'              => $this->example,
                'unit_id'              => $this->unit_id,
                'book_id'              => $this->book_id,
                'word_translate'       => TranslateResource::collection($this->translations)->resolve(),
                'definition_translate' => TranslateResource::collection($this->definitionTranslations)->resolve(),
                'example_translate'    => TranslateResource::collection($this->exampleTranslations)->resolve(),
                'word_statistic'       => $statistic,
        ];
    }
}
