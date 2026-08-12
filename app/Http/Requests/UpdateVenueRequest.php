<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVenueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $venue = $this->route('venue'); // Note: Make sure route parameter is 'venue' or fetch manually if using ID
        if (!$venue) {
            $venue = \App\Models\Venue::find($this->route('id'));
        }
        return $this->user() && ($this->user()->id === $venue?->user_id || $this->user()->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'region' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'address' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_day' => 'required|numeric|min:0',
            'price_per_hour' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'amenities' => 'nullable|array',
            'main_image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
            'gallery' => 'nullable|array',
            'gallery.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mov,avi|max:51200',
            'status' => 'required|in:active,maintenance,booked',
        ];
    }
}
