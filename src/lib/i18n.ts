import { useRouterState } from "@tanstack/react-router";

export const SUPPORTED_LOCALES = ["tr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

function defineDictionary<T extends Record<Locale, unknown>>(value: T) {
  return value;
}

export const dictionaries = defineDictionary({
  tr: {
    brand: {
      name: "Dragoman Bahce",
      location: "Kas, Antalya",
      instagram: "@dragomanbahce",
      hours: "Her gun · 17:00 - 02:00",
      phone: "+90 ___ ___ __ __",
      footerTagline: "Kas'in kalbinde; serin bir bahce ve ozenli kokteyller.",
    },
    common: {
      home: "Anasayfa",
      menu: "Menu",
      songs: "Sarki",
      about: "Hakkimizda",
      admin: "Personel",
      loading: "Yukleniyor...",
      save: "Kaydet",
      cancel: "Iptal",
      remove: "Kaldir",
      clear: "Temizle",
      all: "Tumu",
      active: "Aktif",
      inactive: "Pasif",
      language: "Dil",
      tryAgain: "Tekrar dene",
      goHome: "Anasayfaya don",
      unauthorized: "Yetkin yok",
      notFoundTitle: "Bu sayfa kayip",
      notFoundBody: "Aradigin sayfa mevcut degil ya da tasinmis olabilir.",
    },
    nav: {
      sinceSea: "since the sea",
      ourStory: "bizim hikayemiz",
      nextSong: "next song",
      staffOnly: "staff only",
      adminLabel: "Yonetim",
      signOut: "Cikis",
    },
    switcher: {
      tr: "TR",
      en: "EN",
    },
    nowPlaying: {
      label: "Su an caliyor",
      emptyTitle: "Sessizligin muzigi",
      emptyArtist: "Bir seyler hazirlaniyor...",
    },
    categories: {
      kokteyller: "Kokteyller",
      biralar: "Biralar",
      saraplar: "Saraplar",
      soguk_icecekler: "Soguk Icecekler",
      sicak_icecekler: "Sicak Icecekler",
      atistirmaliklar: "Atistirmaliklar",
    },
    statuses: {
      pending: "Bekliyor",
      approved: "Onayli",
      played: "Calindi",
      rejected: "Reddedildi",
    },
    home: {
      title: "Dragoman Bahce - Kas'ta Akdeniz Bahcesi",
      description: "Beer · Snacks · Cocktails. Kas'in kalbinde, mum isiginda bir bahce.",
      heroTitleTop: "Kas'in kalbinde",
      heroTitleBottom: "bir Akdeniz bahcesi.",
      heroBody:
        "Mum isiginda, palmiye golgesinde - ozenle hazirlanmis kokteyller ve uzun yaz geceleri.",
      ctaMenu: "Menuyu Kesfet",
      ctaSong: "Sarki Oner",
      highlightsEyebrow: "beer · snacks · cocktails",
      highlightsTitleTop: "Uc guzel sey,",
      highlightsTitleBottom: "uc ayri zevk",
      cards: [
        { title: "Cocktails", desc: "Imza karisimlar; taze otlar ve narenciye." },
        { title: "Beer", desc: "Buz gibi yerel ve dunya biralari." },
        { title: "Snacks", desc: "Hafif tabaklar, mezeler, paylasimlik lezzetler." },
      ],
      storyTitle: "Bahcede bir omur yaz",
      storyBody:
        "Kas'in masmavi suyunu iceride degil, disarida yasiyoruz - palmiyelerin altinda, fenerlerin isiginda.",
      readMore: "Devamini oku",
    },
    aboutPage: {
      title: "Hakkimizda - Dragoman Bahce",
      description: "Kas'ta kucuk bir Akdeniz bahcesi.",
      heading: "Hakkimizda",
      bridgeTitle: '"Tercuman" demek - iki dunya arasinda kopru kuran.',
      intro: "Dragoman Bahce, Kas'ta kucuk ama sahici bir mola noktasi.",
      paragraph1:
        "Sabahlari dalis, ogleden sonra Akdeniz'in en mavi sulari; geceleri ise serin bir bahcede mum isiginda bir kadeh. Burada pub gibi agir yemek yok - ozenle hazirlanmis kokteyller, soguk biralar, saraplar ve hafif atistirmaliklar var.",
      paragraph2:
        'Misafirlerimizi caretta carettalar, palmiye golgeleri ve hep bir ezgi karsilar. Muzigi siz secin: aklinizdaki sarkiyi "Sarki Oner" sayfasindan bize gonderin.',
      badges: [
        { key: "Konum", value: "Kas" },
        { key: "Sezon", value: "Nis-Kas" },
        { key: "Konsept", value: "Bahce" },
      ],
    },
    menuPage: {
      title: "Menu - Dragoman Bahce",
      description: "Biralar, kokteyller, saraplar, sicak ve soguk icecekler ile atistirmaliklar.",
      eyebrow: "la carte",
      heading: "Menu",
      subheading: "Akdeniz esintisinde, ozenli bir liste.",
      loading: "Yukleniyor...",
      empty: "Bu kategoride henuz urun yok.",
    },
    songPage: {
      title: "Sarki Oner - Dragoman Bahce",
      description: "Bahcede calmasini istediginiz sarkiyi bize gonderin.",
      heading: "Siradaki parca?",
      subheading: "DJ'imize gonder, bahcede calsin.",
      guestName: "Adin (opsiyonel)",
      songTitle: "Sarki *",
      artist: "Sanatci",
      note: "Bir not (opsiyonel)",
      notePlaceholder: "Bu sarkiyi neden duymak istiyorsun?",
      submit: "Oneriyi Gonder",
      sending: "Gonderiliyor...",
      successTitle: "Aldik, tesekkurler!",
      successBody: "Bahcede calmasini umuyoruz.",
      submitAnother: "Bir tane daha oner",
      helper:
        "Tum istekler ekibimize iletilir. Calma sirasi ve uygunluk DJ'imizin degerlendirmesindedir - sabirla bekleyin.",
      errors: {
        songRequired: "Sarki adi gerekli",
        generic: "Bir seyler ters gitti, tekrar dener misin?",
      },
      placeholders: {
        guestName: "Misafir",
        songTitle: "Orn: Kaptan",
        artist: "Orn: Mor ve Otesi",
      },
    },
    authPage: {
      title: "Personel Girisi - Dragoman Bahce",
      heading: "Personel Girisi",
      welcomeBack: "Hos geldin.",
      signupIntro: "Yeni hesap olustur.",
      email: "E-posta",
      password: "Sifre (en az 6 karakter)",
      signIn: "Giris Yap",
      signUp: "Hesap Olustur",
      noAccount: "Hesabin yok mu?",
      hasAccount: "Hesabin var mi?",
      switchToSignup: "Kaydol",
      switchToSignin: "Giris Yap",
      firstUserAdmin: "Ilk kayit olan kullanici otomatik admin olur.",
      backHome: "Anasayfa",
      invalidCredentials: "E-posta veya sifre hatali.",
    },
    adminPage: {
      title: "Yonetim - Dragoman Bahce",
      summary: "Bugunun ozeti.",
      quickActions: "Hizli islemler",
      updateMenu: "Menu ekle/duzenle",
      viewSongs: "Sarki isteklerini gor",
      updateNowPlaying: "Su an calani guncelle",
      dashboard: "Pano",
      users: "Personel",
      songs: "Sarkilar",
      nowPlaying: "Calan",
      menu: "Menu",
      accessDenied: "Hesabina henuz personel rolu verilmedi.",
      userRequired: "Yetki gerekli",
      usersOnlyAdmin: "Bu sayfayi yalnizca admin gorebilir.",
      staffSignupHint: "Yeni personel /auth sayfasindan kayit olabilir.",
    },
    adminMenuPage: {
      heading: "Menu",
      subheading: "Urunleri yonet.",
      newItem: "Yeni",
      noItems: "Henuz urun yok.",
      edit: "Duzenle",
      newProduct: "Yeni Urun",
      editProduct: "Duzenle",
      confirmDelete: "Bu urunu silmek istediginden emin misin?",
      upload: "Yukle",
      uploading: "Yukleniyor...",
      uploadFailed: "Yukleme basarisiz",
      fields: {
        name: "Ad *",
        category: "Kategori",
        price: "Fiyat (TL)",
        order: "Sira",
        description: "Aciklama",
        tags: "Etiketler (virgulle)",
        details: "Detaylar (anahtar:deger, virgulle)",
        image: "Gorsel",
        imagePlaceholder: "https://...",
        active: "Menude aktif",
      },
    },
    adminSongsPage: {
      heading: "Sarki Istekleri",
      subheading: "Onerileri yonet.",
      empty: "Hic istek yok.",
      approve: "Onayla",
      played: "Calindi",
      reject: "Reddet",
      delete: "Sil",
      confirmDelete: "Silinsin mi?",
    },
    adminNowPlayingPage: {
      heading: "Su An Calan",
      subheading: "Misafirlere gorunen widget'i guncelle.",
      saved: "Kaydedildi",
      fields: {
        track: "Sarki",
        artist: "Sanatci",
        cover: "Kapak URL (opsiyonel)",
      },
    },
    adminUsersPage: {
      heading: "Personel",
      empty: "Henuz kayitli personel yok.",
      admin: "Admin",
      staff: "Personel",
      makeAdmin: "Admin yap",
      removeAdmin: "Adminligi kaldir",
    },
  },
  en: {
    brand: {
      name: "Dragoman Bahce",
      location: "Kas, Antalya",
      instagram: "@dragomanbahce",
      hours: "Every day · 17:00 - 02:00",
      phone: "+90 ___ ___ __ __",
      footerTagline: "In the heart of Kas; a cool garden and carefully made cocktails.",
    },
    common: {
      home: "Home",
      menu: "Menu",
      songs: "Songs",
      about: "About",
      admin: "Staff",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      remove: "Remove",
      clear: "Clear",
      all: "All",
      active: "Active",
      inactive: "Inactive",
      language: "Language",
      tryAgain: "Try again",
      goHome: "Go home",
      unauthorized: "Access denied",
      notFoundTitle: "This page is missing",
      notFoundBody: "The page you are looking for does not exist or may have moved.",
    },
    nav: {
      sinceSea: "since the sea",
      ourStory: "our story",
      nextSong: "next song",
      staffOnly: "staff only",
      adminLabel: "Admin",
      signOut: "Sign out",
    },
    switcher: {
      tr: "TR",
      en: "EN",
    },
    nowPlaying: {
      label: "Now playing",
      emptyTitle: "The sound of silence",
      emptyArtist: "Something is being prepared...",
    },
    categories: {
      kokteyller: "Cocktails",
      biralar: "Beers",
      saraplar: "Wines",
      soguk_icecekler: "Cold Drinks",
      sicak_icecekler: "Hot Drinks",
      atistirmaliklar: "Snacks",
    },
    statuses: {
      pending: "Pending",
      approved: "Approved",
      played: "Played",
      rejected: "Rejected",
    },
    home: {
      title: "Dragoman Bahce - A Mediterranean Garden in Kas",
      description: "Beer · Snacks · Cocktails. A candle-lit garden in the heart of Kas.",
      heroTitleTop: "In the heart of Kas,",
      heroTitleBottom: "a Mediterranean garden.",
      heroBody: "Candle light, palm shade, carefully crafted cocktails, and long summer nights.",
      ctaMenu: "Explore the Menu",
      ctaSong: "Suggest a Song",
      highlightsEyebrow: "beer · snacks · cocktails",
      highlightsTitleTop: "Three lovely things,",
      highlightsTitleBottom: "three distinct pleasures",
      cards: [
        { title: "Cocktails", desc: "Signature mixes with fresh herbs and citrus." },
        { title: "Beer", desc: "Ice-cold local and international beers." },
        { title: "Snacks", desc: "Light plates, mezze, and shareable bites." },
      ],
      storyTitle: "A lifetime of summer in the garden",
      storyBody:
        "We live the deep blue of Kas outside, under palms and lantern light, never behind closed doors.",
      readMore: "Read more",
    },
    aboutPage: {
      title: "About - Dragoman Bahce",
      description: "A small Mediterranean garden in Kas.",
      heading: "About",
      bridgeTitle: '"Dragoman" means interpreter - someone who builds a bridge between worlds.',
      intro: "Dragoman Bahce is a small but genuine pause point in Kas.",
      paragraph1:
        "Diving in the morning, the bluest Mediterranean waters in the afternoon, and a glass in a cool garden by candlelight at night. No heavy pub food here - just carefully mixed cocktails, cold beers, wines, and light bites.",
      paragraph2:
        'Our guests are welcomed by caretta carettas, palm shadows, and always a melody. Pick the music yourself: send us the song on your mind from the "Suggest a Song" page.',
      badges: [
        { key: "Location", value: "Kas" },
        { key: "Season", value: "Apr-Nov" },
        { key: "Concept", value: "Garden" },
      ],
    },
    menuPage: {
      title: "Menu - Dragoman Bahce",
      description: "Beers, cocktails, wines, hot and cold drinks, plus snacks.",
      eyebrow: "la carte",
      heading: "Menu",
      subheading: "A carefully shaped list with a Mediterranean breeze.",
      loading: "Loading...",
      empty: "There are no items in this category yet.",
    },
    songPage: {
      title: "Suggest a Song - Dragoman Bahce",
      description: "Send us the song you want to hear in the garden.",
      heading: "What should play next?",
      subheading: "Send it to our DJ and let it drift through the garden.",
      guestName: "Your name (optional)",
      songTitle: "Song *",
      artist: "Artist",
      note: "A note (optional)",
      notePlaceholder: "Why do you want to hear this song?",
      submit: "Send Request",
      sending: "Sending...",
      successTitle: "Got it, thank you!",
      successBody: "We hope it finds its way into the garden tonight.",
      submitAnother: "Suggest another one",
      helper:
        "All requests reach our team. Queue timing and suitability are up to the DJ, so hang tight.",
      errors: {
        songRequired: "Song title is required",
        generic: "Something went wrong. Could you try again?",
      },
      placeholders: {
        guestName: "Guest",
        songTitle: "For example: Kaptan",
        artist: "For example: Mor ve Otesi",
      },
    },
    authPage: {
      title: "Staff Login - Dragoman Bahce",
      heading: "Staff Login",
      welcomeBack: "Welcome back.",
      signupIntro: "Create a new account.",
      email: "Email",
      password: "Password (minimum 6 characters)",
      signIn: "Sign In",
      signUp: "Create Account",
      noAccount: "No account yet?",
      hasAccount: "Already have an account?",
      switchToSignup: "Sign up",
      switchToSignin: "Sign in",
      firstUserAdmin: "The first registered user becomes admin automatically.",
      backHome: "Back home",
      invalidCredentials: "Incorrect email or password.",
    },
    adminPage: {
      title: "Admin - Dragoman Bahce",
      summary: "Today's summary.",
      quickActions: "Quick actions",
      updateMenu: "Add or edit menu items",
      viewSongs: "Review song requests",
      updateNowPlaying: "Update now playing",
      dashboard: "Dashboard",
      users: "Staff",
      songs: "Songs",
      nowPlaying: "Now Playing",
      menu: "Menu",
      accessDenied: "Your account has not been assigned a staff role yet.",
      userRequired: "Permission required",
      usersOnlyAdmin: "Only admins can see this page.",
      staffSignupHint: "New staff members can sign up from /auth.",
    },
    adminMenuPage: {
      heading: "Menu",
      subheading: "Manage items.",
      newItem: "New",
      noItems: "No items yet.",
      edit: "Edit",
      newProduct: "New Item",
      editProduct: "Edit Item",
      confirmDelete: "Are you sure you want to delete this item?",
      upload: "Upload",
      uploading: "Uploading...",
      uploadFailed: "Upload failed",
      fields: {
        name: "Name *",
        category: "Category",
        price: "Price (TRY)",
        order: "Order",
        description: "Description",
        tags: "Tags (comma separated)",
        details: "Details (key:value, comma separated)",
        image: "Image",
        imagePlaceholder: "https://...",
        active: "Visible on menu",
      },
    },
    adminSongsPage: {
      heading: "Song Requests",
      subheading: "Manage guest suggestions.",
      empty: "No requests yet.",
      approve: "Approve",
      played: "Played",
      reject: "Reject",
      delete: "Delete",
      confirmDelete: "Delete this request?",
    },
    adminNowPlayingPage: {
      heading: "Now Playing",
      subheading: "Update the widget guests see on the public site.",
      saved: "Saved",
      fields: {
        track: "Track",
        artist: "Artist",
        cover: "Cover URL (optional)",
      },
    },
    adminUsersPage: {
      heading: "Staff",
      empty: "No staff records yet.",
      admin: "Admin",
      staff: "Staff",
      makeAdmin: "Make admin",
      removeAdmin: "Remove admin",
    },
  },
});

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleFromUnknown(value: string | undefined): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return getLocaleFromUnknown(segment);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localizePath(locale: Locale, path = ""): string {
  if (!path || path === "/") {
    return `/${locale}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function stripLocaleFromPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  const [, ...rest] = isLocale(parts[0] ?? "") ? parts : ["", ...parts];
  return rest.length ? `/${rest.join("/")}` : "/";
}

export function swapLocaleInPathname(pathname: string, locale: Locale): string {
  return localizePath(locale, stripLocaleFromPathname(pathname));
}

export function useI18n() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  return { locale, dictionary };
}
