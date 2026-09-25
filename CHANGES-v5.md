# v7: hero photos changed + clearer (lighter overlay), new dish-card design.

# v6 changes
1. Lower slider removed. Old hero photo replaced by an auto-sliding hero (HeroSlider.jsx): 5 food photos + last slide = ad video. Hero made a bit smaller.

# v5 changes
1. Old "Chef's Reel" video ad (PromoVideoAd.jsx) deleted completely.
2. New homepage ad slider (frontend/src/components/HomeAdSlider.jsx): slide 1 & 2 = paneer images (auto), slide 3 = veg/sabji video. No meat anywhere.
3. Order tracker always starts from step 0 (Placed) for a new order: stale data from a previous order can no longer show; late replies for old orders are ignored; order numbers are now unique; tracker looks up by exact id first.
4. Light theme: ✕ close and ⟳ refresh buttons now clearly visible (class `icon-btn`); "hover:text-white" invisible-on-hover bug fixed.
5. Dish cards / trust tiles / buttons: deeper 3D look (CSS only, index.css bottom "v5 FIXES").
