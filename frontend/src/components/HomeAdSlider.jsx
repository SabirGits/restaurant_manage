import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Leaf, ArrowRight, Volume2, VolumeX } from "lucide-react";

/**
 * Homepage ad slider (pure-veg only).
 *
 *   Slide 1 -> image (paneer)      auto-advances
 *   Slide 2 -> image (paneer)      auto-advances
 *   Slide 3 -> VIDEO (sabji / veg) plays, then the slider loops back to slide 1
 *
 * No meat anywhere. If an image / clip can't be loaded it tries the next
 * fallback for that slide, and if all fail that slide is skipped quietly
 * (the slider never shows a broken box).
 */
const IMAGE_SLIDE_MS = 4500;      // how long each image stays
const VIDEO_MAX_MS = 14000;       // safety: move on even if a clip never ends

const SLIDES = [
  {
    id: "img-1",
    type: "image",
    srcs: [
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1600&q=80"
    ],
    title: "Paneer Tikka, straight from the tandoor",
    sub: "Soft paneer, smoky char, pure vegetarian."
  },
  {
    id: "img-2",
    type: "image",
    srcs: [
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=1600&q=80"
    ],
    title: "Creamy paneer, rich royal gravy",
    sub: "Cooked slow with cashew, cream and whole spices."
  },
  {
    id: "vid-3",
    type: "video",
    srcs: [
      "https://assets.mixkit.co/videos/47555/47555-360.mp4",   // chef stir-frying vegetables
      "https://assets.mixkit.co/videos/10420/10420-360.mp4",   // fresh vegetables close-up
      "https://assets.mixkit.co/videos/10433/10433-360.mp4"    // fruits & vegetables
    ],
    title: "Fresh sabzi, cooked live on high flame",
    sub: "Farm-fresh vegetables, tossed hot and served to your table."
  }
];

const HomeAdSlider = ({ onExploreClick }) => {
  // per-slide index of the fallback source currently in use
  const [srcStep, setSrcStep] = useState({});
  // slides whose every source failed -> skipped
  const [dead, setDead] = useState({});
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const live = useMemo(() => SLIDES.filter((s) => !dead[s.id]), [dead]);
  const current = live[Math.min(active, live.length - 1)];

  const go = useCallback(
    (dir) => setActive((i) => (live.length ? (i + dir + live.length) % live.length : 0)),
    [live.length]
  );

  // Auto-advance. Images use a timer; the video advances when it ends
  // (with a max-time safety net in case the clip stalls).
  useEffect(() => {
    if (!current || live.length < 2) return;
    const ms = current.type === "video" ? VIDEO_MAX_MS : IMAGE_SLIDE_MS;
    const t = setTimeout(() => go(1), ms);
    return () => clearTimeout(t);
  }, [current?.id, live.length, go]);

  const failSource = (slide) => {
    const next = (srcStep[slide.id] || 0) + 1;
    if (next >= slide.srcs.length) {
      setDead((d) => ({ ...d, [slide.id]: true }));
    } else {
      setSrcStep((s) => ({ ...s, [slide.id]: next }));
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  if (!current) return null;

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-2" aria-label="Featured vegetarian specials">
      <div className="ad-slider relative rounded-3xl overflow-hidden shadow-premium border border-zinc-800/60 h-56 sm:h-72 lg:h-80 bg-zinc-900">
        {live.map((slide, idx) => {
          const isActive = slide.id === current.id;
          const src = slide.srcs[srcStep[slide.id] || 0];
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none"}`}
              aria-hidden={!isActive}
            >
              {slide.type === "image" ? (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={() => failSource(slide)}
                  className={`w-full h-full object-cover ${isActive ? "ad-kenburns" : ""}`}
                />
              ) : (
                // Mounted only while active, so the clip always starts from 0:00
                isActive && (
                  <video
                    ref={videoRef}
                    key={src}
                    src={src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={muted}
                    playsInline
                    preload="auto"
                    onEnded={() => go(1)}
                    onError={() => failSource(slide)}
                  />
                )
              )}
            </div>
          );
        })}

        {/* readable scrim over any frame */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/15 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none" />

        {/* pure-veg chip */}
        <span className="absolute top-3 left-3 z-[3] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-[0.12em] border border-emerald-400/40">
          <Leaf className="w-3 h-3" /> Pure Veg Special
        </span>

        {/* caption + CTA */}
        <div className="absolute inset-x-0 bottom-0 z-[3] p-4 sm:p-6 pb-9 sm:pb-10 flex items-end justify-between gap-4">
          <div key={current.id} className="max-w-md ad-caption">
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white leading-snug drop-shadow">
              {current.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-200/90 mt-1 hidden sm:block">{current.sub}</p>
          </div>
          <button
            onClick={onExploreClick}
            className="btn-3d shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* arrows */}
        {live.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="ad-nav absolute left-2 top-1/2 -translate-y-1/2 z-[4] p-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next slide"
              className="ad-nav absolute right-2 top-1/2 -translate-y-1/2 z-[4] p-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* sound toggle (video slide only) */}
        {current.type === "video" && (
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute top-3 right-3 z-[4] p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* dots */}
        {live.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-[4] flex items-center justify-center gap-2">
            {live.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${s.id === current.id ? "w-6 bg-amber-400" : "w-1.5 bg-white/60 hover:bg-white"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { HomeAdSlider };
