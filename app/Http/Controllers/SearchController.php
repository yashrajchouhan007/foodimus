<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Influencer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SearchController extends Controller
{
    public function view(Request $request)
    {
        $section = $request->section;
        if ($section === null) {
            return Redirect::route('search', [
                'section' => 'ambassador',
            ]);
        }

        $data = [
            'heroImg' => [
                'src' => 'http://1.cdn.foodimus.com/assets/203f943a-df43-4fd0-ad18-5cb399ecbee8.jpg',
                'focus' => [0.5, 0.3],
            ],
        ];
        $src = null;
        try {
            [
                'search_header_src' => $src,
                'search_header_focus_x' => $focus_x,
                'search_header_focus_y' => $focus_y
            ] = nova_get_settings(['search_header_src', 'search_header_focus_x', 'search_header_focus_y']);
        } catch (\Exception $e) {
            \Sentry\captureException($e);
        }
        if ($src) {
            $data['heroImg'] = [
                'src' => $src,
                'focus' => [$focus_x === null ? 0.5 : $focus_x, $focus_y === null ? 0.5 : $focus_y],
            ];
        }
        if ($section === 'meal-plan') {
            $start = 0;
            $count = 20;

            /** @var \Illuminate\Database\Eloquent\Collection $details */
            $details = \App\Models\Program::wherePublished(true)
                ->with('influencer', 'influencer.avatar', 'heroImage')
                ->orderBy('id', 'desc')
                ->paginate($count);

            /** @var \Illuminate\Database\Eloquent\Collection $items */
            $items = $details
                ->map(function ($i) {
                    /** @var \App\Models\Program $i */
                    return [
                        'name' => $i->name,
                        'slug' => $i->slug,
                        'totalDays' => $i->total_days,
                        'heroImg' => $i->heroImage === null ? null : [
                            'src' => $i->heroImage->src,
                            'focus' => [$i->heroImage->focus_x, $i->heroImage->focus_y],
                        ],
                        'ambassador' => $i->influencer === null ? null : [
                            'name' => $i->influencer->full_name,
                            'slug' => $i->influencer->slug,
                            'avatar' => $i->influencer->avatar === null ? null : [
                                'src' => $i->influencer->avatar->src,
                                'orientation' => $i->influencer->avatar->orientation,
                            ],
                        ],
                    ];
                });
            $data['mealPlan'] = $items->toArray();
            $data['hasNext'] = $details->count() > $count;
            $data['hasPrev'] = $start > 0;
        } elseif ($section === 'ambassador') {
            $start = 0;
            $count = 20;

            /** @var \Illuminate\Database\Eloquent\Collection $details */
            $details = Influencer::wherePublished(true)
                ->with('avatar', 'heroImage')
                ->orderBy('id', 'desc')
                ->paginate($count);

            /** @var \Illuminate\Database\Eloquent\Collection $items */
            $items = $details
                ->map(function ($i) {
                    /** @var Influencer $i */
                    return [
                        'name' => $i->full_name,
                        'title' => $i->title,
                        'slug' => $i->slug,
                        'heroImg' => $i->heroImage,
                        'avatar' => $i->avatar,
                    ];
                });
            $data['ambassador'] = $items->toArray();
            $data['hasNext'] = $details->count() > $count;
            $data['hasPrev'] = $start > 0;
        } else {
            throw new NotFoundHttpException();
        }

        return Inertia::render('MyFoodimus/Search', $data);
    }
}
