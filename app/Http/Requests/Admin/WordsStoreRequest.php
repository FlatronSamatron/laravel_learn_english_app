<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class WordsStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
                '*.word_hash'     => 'required|string',
                '*.name'          => 'required|string',
                '*.transcription' => 'required|string',
                '*.definition'    => 'required|string',
                '*.example'       => 'required|string',
                '*.unit_id'       => 'required|int',
                '*.book_id'       => 'required|int',
                '*.translate'       => 'required|array'
        ];
    }
}
