# FoodieHub Redesign — Kya Kya Change Hua (Change Report)

Ye aapke existing `Restaurant-Full-Project` ka **redesign** hai — koi feature
delete nahi hua, koi API name nahi badla, MongoDB integration waisa ka waisa hai.
Sirf wahi changes kiye gaye hain jo aapne bataye the.

---

## 1. UI / UX + Colors — reference image ke hisab se

Poora design system `frontend/src/index.css` me rewrite kiya gaya hai.
Aapki image ki exact palette use ki hai:

| | Background | Surface | Border / Muted | Gold | Gold Light | Green | Red |
|---|---|---|---|---|---|---|---|
| **Dark** | `#0B0D0F` | `#15191C` | `#1C2125` | `#D6A84F` | `#F2C76E` | `#35C48A` | `#E86A6A` |
| **Light** | `#F7F4ED` | `#FFFFFF` | `#F0ECE3` | `#B88732` | `#D6A84F` | `#21BA62` | `#C94D4D` |

Poora project `zinc` / `amber` / `emerald` / `rose` Tailwind utilities pe likha
hua tha, isliye maine **un ramps ko hi brand palette pe re-point** kar diya.
Fayda: customer site **aur** admin panel — dono screens automatically naye look
me aa gaye, bina 7,600 lines ke classes chhede. Zero functionality risk.

Naya bhi add hua:
- Warm ambient page wash (dono themes me alag)
- Gold gradient heading text (`.text-gold-gradient`) — "Good **Mood**" wale style ke liye
- Gold scrollbars
- Homepage hero ab reference jaisa: **"Good Food / Good Mood"** + restaurant name + info badges

## 2. Light + Dark — dono themes

Pehle se maujood `ThemeContext` hi use hota hai (navbar ka sun/moon toggle,
localStorage me save, pehli baar OS preference follow karta hai).
Ab dono themes properly tuned hain:
- Light me surfaces cream/white ho jaate hain, gold thoda dark ho jaata hai taaki text readable rahe
- Solid gold/green/red chips dono themes me apna white/dark text sahi rakhte hain
- Modal overlays aur photo captions dono themes me dark rehte hain (contrast ke liye)

## 3. 3D

- **Hero**: perspective grid floor (3D room jaisa), rotating conic halo, floating
  gradient blobs, parallax drift layers
- **Feature coins**: Fresh Food Daily / Fast Service Always / Hygienic & Safe /
  Best Taste Guaranteed — raised metallic gold coins jo hover pe 3D rotate hote hain
- **Dish cards**: pointer-follow tilt, photo pop-out (translateZ), badges alag Z-plane pe
- **Glass tiles**: hover pe viewer ki taraf uthte hain
- **Buttons**: `.btn-3d` extruded look, click pe press-down
- **Tracking modal**: stage icon 3D spring-flip ke saath change hota hai

## 4. "Ask" button — ab navbar me hai

Pehle `ChatAssistant` ka launcher **menu page ke sabse neeche** floating button tha
(`fixed bottom-5 right-5`). Wo **hata diya gaya hai**.

Ab:
- Navbar me **"Ask Us"** button hai (desktop pe icon + text, mobile pe icon)
- Mobile hamburger sheet me bhi "Ask Us" available hai
- `ChatAssistant` ab controlled component hai: `<ChatAssistant isOpen={...} onClose={...} />`

Files: `components/Navbar.jsx`, `components/ChatAssistant.jsx`, `pages/CustomerHome.jsx`

## 5. Order tracking — steps ab khud chalte hain (har ~3 min)

Pehle order status tabhi badalta tha jab admin manually change kare. Ab backend me
**kitchen flow timer** hai:

```
Order Placed → Kitchen Accepted → Cooking → Ready → Served
   0 min          3 min             6 min    9 min   12 min
```

- Step gap `.env` se control hota hai: `AUTO_STATUS_STEP_MINUTES=3` (2–4 min ke beech
  jo chahiye rakh lo)
- Band karna ho to `.env` me `AUTO_ORDER_FLOW="off"`
- Ye **kabhi backwards nahi jaata** — agar kitchen/admin ne manually aage badha diya,
  timer usko chhedta nahi
- Har stage order ki `timeline` me record hota hai (admin order detail me dikhta hai)
- `Completed` timer se nahi hota — wo tabhi hota hai jab bill actually settle ho
- Server pe 30-second background tick bhi chalta hai, taaki koi tracker khula na ho
  tab bhi orders aage badhte rahein
- Customer ka tracker har 4 second poll karta hai → steps ek ke baad ek light up hote hain
- ETA countdown bhi same schedule se aligned hai, isliye timer aur stepper kabhi
  ek dusre se disagree nahi karte

Files: `backend/backend/services/dbService.js`, `backend/index.js`, `backend/.env.example`

## 6. Tracking modal ki height/width kam ki

| | Pehle | Ab |
|---|---|---|
| Width | `max-w-lg` (512px) | `max-w-sm` (384px) |
| Stepper | 6-step tall vertical timeline | 5-step compact horizontal rail |
| Items list | hamesha khuli | default collapsed, tap karke khulti hai |
| Height | page ke saath badhti thi | `max-h-[88vh]`, andar scroll |

Ab phone pe bina scroll ke fit ho jaata hai, aur desktop pe screen nahi ghera.

## 7. Phone / Tablet / PC — teeno pe sahi

- **Phone (≤640px)**: tilt/hover 3D off (touch pe meaning nahi), blobs & halo halke,
  grid chhota, navbar me hamburger sheet, buttons thumb-friendly
- **Tablet (≤1024px)**: medium depth, feature grid 2-column
- **Touch devices** (`hover: none`): saare hover-only 3D transforms disabled, taaki
  kuch "stuck" na dikhe
- `overflow-x: hidden` — koi bhi wide element sideways scroll nahi bana sakta
- `prefers-reduced-motion` respect hota hai

---

# Chalane Ka Tarika (Setup)

## Backend

```bash
cd backend
npm install
cp .env.example .env      # pehle se ready hai, seedha chal jaayega
npm run dev               # http://localhost:5000
```

MongoDB chahiye to `.env` me `MONGODB_URI` set karo (Compass wala local URI pehle se
daala hua hai). Agar MongoDB nahi mila, backend automatically `backend/data/` wale
JSON engine pe fallback ho jaata hai — sab kuch full working rehta hai.

## Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Vite `/api` ko automatically `localhost:5000` pe proxy karta hai, isliye CORS ka
koi jhanjhat nahi.

- Customer site: `http://localhost:5173/`
- Admin panel: `http://localhost:5173/admin`
- Default admin login: `admin@restaurant.com` / `Admin@123456`

## Test Karne Ke Steps

1. `http://localhost:5173/` kholo → hero "Good Food / Good Mood" + 4 gold coins dikhne chahiye
2. Navbar ka **sun/moon** dabao → light theme cream/white + dark gold me switch ho
3. Navbar ka **"Ask Us"** dabao → assistant khule (neeche wala floating button ab nahi hai)
4. Koi dish add karo → cart → order place karo
5. **Track Order** kholo aur khula chhod do → ~3 min me "Accepted", ~6 min me "Cooking",
   ~9 min me "Ready", ~12 min me "Served" apne aap ho jaayega
   - Jaldi test karna ho to `.env` me `AUTO_STATUS_STEP_MINUTES=1` kar do
6. Browser ko phone width (390px) aur tablet width (768px) pe resize karke dekho

---

# Jo Bilkul Nahi Chheda

- Koi API endpoint ka naam ya shape
- MongoDB models / Mongoose schemas
- Admin authentication (JWT)
- Cart, payment, invoice, GST calculation logic
- Menu items, categories, tables ka data
- Frontend aur backend ka separate structure
