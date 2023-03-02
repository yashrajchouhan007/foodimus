<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Influencer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InfluencerController extends Controller
{
    public function view(Request $request)
    {
        $slug = $request->slug;

        /** @var Influencer $influencer */
        $influencer = Influencer::whereSlug($slug)->with('overlayImage', 'avatar', 'signatureImage')->first();

        if ($influencer === null) {
            throw new NotFoundHttpException();
        }

        $programs = $influencer->programs()
            ->where('featured', true)
            ->get();

        $data = [
            'header' => [
                'backgroundColor' => $influencer->header_color,
                'logoColor' => $influencer->logo_color,
                'ambassadorImg' => $influencer->overlayImage === null
                    ? null
                    : $influencer->overlayImage->src,
                'box' => [
                    'textMobile' => $influencer->header_box_text_mobile,
                    'textDesktop' => $influencer->header_box_text_desktop,
                ],
            ],
            'story' => $influencer->story,
            'ambassador' => [
                'avatar' => $influencer->avatar,
                'signature' => $influencer->signatureImage,
                'instagramUrl' => $influencer->instagram_url,
                'facebookUrl' => $influencer->facebook_url,
            ],
            'heroMealPlans' => $programs->toArray(),
        ];
        return Inertia::render('MyFoodimus/Ambassador', $data);
    }
}
