# SearchLessons Frontend

SearchLessons - bu ta'lim markazlarini topish va tanlash uchun yaratilgan zamonaviy web ilovasi.

## Xususiyatlar

- 🏫 **Ta'lim markazlari** - Barcha ta'lim markazlarini ko'rish va qidirish
- 📚 **Fanlar va yo'nalishlar** - Mavjud fanlar va ta'lim yo'nalishlari
- 📖 **Ta'lim resurslari** - Foydali materiallar va hujjatlar
- 🔍 **Kuchli qidiruv** - Hudud, fan yoki markaz nomi bo'yicha qidirish
- ⭐ **Reytinglar va izohlar** - Foydalanuvchilar reytinglari
- 👤 **Foydalanuvchi tizimi** - Ro'yxatdan o'tish va kirish
- 📱 **Responsive dizayn** - Barcha qurilmalarda ishlaydi

## Texnologiyalar

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## O'rnatish

1. Repositoryni klonlang:

```bash
git clone <repository-url>
cd searchlessonsfrontend
```

2. Dependencylarni o'rnating:

```bash
npm install
```

3. Development serverini ishga tushiring:

```bash
npm run dev
```

4. Brauzerda oching: `http://localhost:5173`

## Build

Production uchun build qilish:

```bash
npm run build
```

## API

Frontend backend API bilan ishlaydi. Backend server `http://localhost:3000` da ishlashi kerak.

## Struktura

```
src/
├── components/          # Qayta ishlatiluvchi komponentlar
├── contexts/           # React Context
├── lib/               # Utility funksiyalar va API
├── pages/             # Sahifa komponentlari
└── App.tsx           # Asosiy App komponenti
```

## Sahifalar

- `/` - Asosiy sahifa
- `/login` - Kirish sahifasi
- `/register` - Ro'yxatdan o'tish
- `/verify-otp` - OTP tasdiqlash
- `/centers` - Ta'lim markazlari
- `/subjects` - Fanlar va yo'nalishlar
- `/resources` - Ta'lim resurslari

## Rivojlantirish

1. Yangi feature qo'shish uchun branch yarating
2. O'zgarishlarni commit qiling
3. Pull request yarating

## Litsenziya

MIT License
