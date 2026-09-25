# Is Round Ke Fixes (Hinglish)

Bataye gaye 5 kaam hi kiye hain, baaki purana code/design bilkul touch nahi kiya.

## 1. Homepage par video-type food ad
- Naya component: `frontend/src/components/PromoVideoAd.jsx`
- Homepage (`CustomerHome.jsx`) par hero section ke turant baad ek autoplay + muted + loop food video banner add kiya (jaisa TV restaurant ad hota hai).
- Sound on/off ka button hai (top-right speaker icon), "Explore Menu" button hai jo neeche menu tak smooth scroll kar deta hai.
- Agar video load na ho to woh chhup jayega (koi broken player nahi dikhega) — site ka baaki hissa affect nahi hoga.

## 2. Table change message light theme mein nahi dikhta tha
- Root cause: toast ka text color (`emerald-100`/`rose-100`/`amber-100`) light theme ke liye theek se remap nahi tha, isliye halka text halke background par gayab ho jata tha.
- Fix: `context/NotificationContext.jsx` mein text color `-400` shade kar diya (jo already baaki app mein use hota hai) — ab dono themes mein clearly dikhega.

## 3. Card khulne par height/width jyada thi
- `components/FoodDetailModal.jsx`: modal size chhoti ki (`max-w-2xl` → `max-w-sm/md`), image height chhoti ki, andar scroll add kiya — ab compact khulega.

## 4. Order tracking — har 1-2 minute mein change, cooking mein thoda jyada time
- `backend/backend/services/dbService.js` + `models/index.js`: har order ka apna alag timing schedule hai (uske apne createdAt se):
  - Order accept: ~1 minute
  - Har normal step: ~1-2 minute
  - Cooking (khana banne ka time): 5-10 minute (dish ke hisaab se) — jaisa bola tha, thoda jyada time
  - Serve karna: baaki jaisa hi jaldi
- `OrderTrackingModal.jsx` mein bhi safety fix: naya order track karte waqt purana data turant clear hota hai taaki koi purana stage flash na ho.

## 5. Cards ki design — advanced 3D, dono themes mein achchi
- `components/FoodCard.jsx` + `index.css`: cards ko ab default resting shadow + hover par deeper 3D lift diya hai, ek halka gold "rim-light" border effect (jo card ko lacquered/physical feel deta hai), price ka apna chhota 3D "coin" style, aur click/tap par press-feedback animation.
- Dono themes (light + dark) ke liye alag se tune kiya hai taaki dono mein achcha lage.

---

Run karne ke steps pehle jaise hi hain: `backend/` → `npm install` → `node index.js`, `frontend/` → `npm install` → `npm run dev`.

Note: Aapka data file (`backend/data/smart_restaurant_db.json`) bilkul waisa hi rakha hai jaisa upload kiya tha — usme koi test/dummy data add ya delete nahi kiya.
