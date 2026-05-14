# Bahcedeonline Teknik Altyapı Dokümanı

## 1. Genel Bakış

`bahcedeonline`, kafe/bar tipi bir mekanın dijital vitrini olarak kurgulanmış Türkçe ağırlıklı bir web uygulamasıdır. Proje; menü gösterimi, şarkı öneri akışı, "şu an çalan" bilgisi ve parola korumalı bir admin paneli içerir.

Teknik olarak uygulama, TanStack Start tabanlı SSR React uygulaması ile bunun önüne yerleştirilmiş özel bir Node HTTP sunucusundan oluşur. Veri, kimlik ve medya yönetimi için Supabase kullanılır. Arayüz katmanında Tailwind CSS v4 ve shadcn/ui bileşenleri tercih edilmiştir.

## 2. Teknoloji Yığını

### Uygulama ve runtime

- `React 19`
- `TanStack Start`
- `TanStack Router`
- `Node.js` tabanlı özel HTTP sunucusu: [server.mjs](/c:/temp_private/bahcedeonline/server.mjs)
- Paket yöneticisi ve script runtime: `Bun`

### UI ve stil

- `Tailwind CSS v4`
- `@tailwindcss/vite`
- `shadcn/ui`
- `Radix UI`
- `Lucide React`

### Veri ve backend servisleri

- `Supabase Database`
- `Supabase Auth`
- `Supabase Storage`
- Tip güvenliği için üretilmiş DB tipleri: [src/integrations/supabase/types.ts](/c:/temp_private/bahcedeonline/src/integrations/supabase/types.ts)

### Form ve doğrulama

- `zod`
- `react-hook-form` bağımlılığı mevcut, ancak mevcut ekranlarda daha çok manuel form state yaklaşımı görülüyor

## 3. Yüksek Seviye Mimari

Uygulama iki ana parçadan oluşur:

1. Kullanıcıya görünen SSR React uygulaması
2. Admin işlemlerini yöneten özel Node API katmanı

İstek akışı genel olarak şöyledir:

1. Tarayıcı isteği `server.mjs` tarafından karşılanır.
2. Eğer istek `/api/admin/*` ile başlıyorsa doğrudan sunucu içindeki admin handler çalışır.
3. Eğer istek `dist/client` altındaki bir statik dosyaya karşılık geliyorsa dosya doğrudan servis edilir.
4. Diğer tüm istekler TanStack Start SSR handler'ına iletilir.

Bu yaklaşım, public site ile admin API'yi aynı deploy birimi içinde tutarken sorumlulukları kod seviyesinde ayırır.

## 4. Frontend Yapısı

### Routing

Dosya tabanlı routing kullanılır. Sayfalar [src/routes](/c:/temp_private/bahcedeonline/src/routes) altında yer alır.

Öne çıkan route grupları:

- Public sayfalar: `/`, `/menu`, `/sarki-oner`, `/hakkimizda`, `/dragomando`, `/kasguide`
- İngilizce varyantlar: `/en/*`
- Admin alanı: `/admin`, `/admin/menu`, `/admin/kartlar`, `/admin/sarkilar`, `/admin/calan`
- Eski auth yönlendirmesi: `/auth` -> `/admin`

TanStack route ağacı [src/routeTree.gen.ts](/c:/temp_private/bahcedeonline/src/routeTree.gen.ts) dosyasına otomatik üretilir; manuel düzenlenmemelidir.

### Router kurulumu

Router kurulumu [src/router.tsx](/c:/temp_private/bahcedeonline/src/router.tsx) içinde yapılır. `scrollRestoration`, varsayılan hata ekranı ve `defaultPreloadStaleTime` ayarları burada tanımlanmıştır.

### Bileşen yapısı

- Ortak bileşenler: [src/components](/c:/temp_private/bahcedeonline/src/components)
- Tasarım sistemi / UI primitive'leri: [src/components/ui](/c:/temp_private/bahcedeonline/src/components/ui)

Kod tabanı shadcn/ui + Radix tabanını kullanıyor; bu da form, modal, accordion, drawer, table gibi yapıların standart ve tekrar kullanılabilir şekilde kurulmasını sağlıyor.

### Stil sistemi

Ana stil dosyası [src/styles.css](/c:/temp_private/bahcedeonline/src/styles.css). Vite tarafında plugin sırası önemlidir:

`tsConfigPaths -> tailwindcss -> tanstackStart -> viteReact`

Bu sıralama [vite.config.ts](/c:/temp_private/bahcedeonline/vite.config.ts) içinde açıkça korunmuştur.

## 5. Çok Dillilik Yapısı

Uygulama Türkçe varsayılan locale ile çalışır ve İngilizce yol öneki (`/en`) destekler.

İlgili yapı:

- Locale context: [src/lib/i18n/LocaleProvider.tsx](/c:/temp_private/bahcedeonline/src/lib/i18n/LocaleProvider.tsx)
- Hook: [src/lib/i18n/useTranslation.ts](/c:/temp_private/bahcedeonline/src/lib/i18n/useTranslation.ts)
- Sözlükler: [src/lib/i18n/dictionaries/tr.ts](/c:/temp_private/bahcedeonline/src/lib/i18n/dictionaries/tr.ts), [src/lib/i18n/dictionaries/en.ts](/c:/temp_private/bahcedeonline/src/lib/i18n/dictionaries/en.ts)

Locale seçimi URL prefix + cookie kombinasyonu ile yönetilir. Ayrıca bazı içerikler veritabanında hem Türkçe hem İngilizce alanlarla tutulur (`title` / `title_en`, `description` / `description_en` gibi).

## 6. Backend ve Admin API Tasarımı

Admin API, framework route'ları yerine doğrudan [server.mjs](/c:/temp_private/bahcedeonline/server.mjs) içinde yazılmıştır. Bu, projede "backend" sorumluluğunun önemli bir kısmının bu dosyada toplandığı anlamına gelir.

### Admin API kapsamı

Sunucudaki endpoint grupları:

- Oturum: `/api/admin/session`, `/api/admin/login`, `/api/admin/logout`
- Dashboard: `/api/admin/dashboard`
- Menü yönetimi: `/api/admin/menu`, `/api/admin/menu/:id`, `/api/admin/menu/upload`
- Şarkı önerileri: `/api/admin/song-requests`, `/api/admin/song-requests/:id`
- Şu an çalan: `/api/admin/now-playing`
- Ana sayfa kartları: `/api/admin/home-cards`, `/api/admin/home-cards/:id`, `/api/admin/home-cards/upload`

Frontend tarafında bu endpoint'lerin fetch katmanı [src/lib/admin-api.ts](/c:/temp_private/bahcedeonline/src/lib/admin-api.ts) içinde merkezi olarak tutulur.

### Neden ayrı bir sunucu katmanı var?

TanStack Start public uygulama için iyi bir SSR çerçevesi sağlıyor; ancak bu projede admin API'nin ayrı ele alınması şu avantajları veriyor:

- Cookie tabanlı özel admin auth akışı kurmak kolaylaşıyor
- Supabase service role anahtarını sadece sunucuda tutmak mümkün oluyor
- Dosya upload ve yönetim aksiyonları tek dosyada toplanıyor

## 7. Kimlik Doğrulama ve Yetkilendirme

Projede iki farklı auth modeli bulunur.

### 7.1 Admin panel auth

Admin paneli Supabase Auth kullanmaz.

Akış:

1. Kullanıcı `/admin` ekranında parola girer.
2. Sunucu, `ADMIN_PASSWORD` env değeri ile karşılaştırma yapar.
3. Başarılıysa HMAC-SHA256 tabanlı `bahce_admin_session` cookie'si set edilir.
4. Sonraki admin API istekleri bu cookie ile doğrulanır.

Bu yapı sade ve operasyonel olarak kolaydır; ancak rol bazlı, kullanıcı bazlı detaylı audit ihtiyacı için sınırlıdır.

### 7.2 Uygulama içi kullanıcı auth

Staff/admin rol mantığı için Supabase Auth kullanılır. Hook seviyesi uygulama [src/hooks/useAuth.ts](/c:/temp_private/bahcedeonline/src/hooks/useAuth.ts) içindedir. Roller `user_roles` tablosundan çekilir.

## 8. Supabase Entegrasyonu

Projede iki farklı Supabase kullanım şekli vardır:

- Browser client: public site ve bazı kullanıcı işlemleri için
- Server client: admin API içinde service role ile

### Browser client

İstemci tarafı singleton yapı [src/integrations/supabase/client.ts](/c:/temp_private/bahcedeonline/src/integrations/supabase/client.ts) içinde tanımlıdır.

Kullanım örnekleri:

- Menü listeleme
- Ana sayfa kartlarını çekme
- Şarkı önerisi gönderme
- Supabase Auth session yönetimi

### Server client

`server.mjs` içindeki `getAdminSupabase()` fonksiyonu service role key ile yetkili bir istemci oluşturur. Bu istemci admin CRUD işlemleri ve storage upload akışında kullanılır.

### Veri modeli

Tip dosyasına göre öne çıkan tablolar:

- `menu_items`
- `song_requests`
- `now_playing`
- `home_cards`
- `user_roles`

Enum'lar:

- `menu_category`
- `request_status`
- `app_role`

Migration dosyaları [supabase/migrations](/c:/temp_private/bahcedeonline/supabase/migrations) altında tutulur.

## 9. Depolama ve Medya Yönetimi

Admin panelinden yüklenen görseller Supabase Storage içindeki `dbahce` bucket'ına yüklenir.

Şu anda sunucu tarafında iki upload akışı vardır:

- Menü görselleri
- Ana sayfa kart görselleri

Yükleme sonrası public URL üretilip frontend'e döndürülür. Public asset'ler için ayrıca `public/` ve `src/assets/` altında yerel medya dosyaları da bulunur.

## 10. Geliştirme Deneyimi

Temel komutlar:

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run typecheck`
- `bun run lint`
- `bun run format`

Notlar:

- Paket yöneticisi olarak `bun` kullanılmalı
- Test framework'ü henüz kurulu değil
- `src/routeTree.gen.ts` otomatik üretilir

## 11. Build ve Deployment

Deploy modeli Docker multi-stage build yaklaşımıyla kurgulanmıştır. Ayrıntılar [Dockerfile](/c:/temp_private/bahcedeonline/Dockerfile) içindedir.

Stage'ler:

1. `deps`: tam bağımlılık kurulumu
2. `builder`: production build
3. `prod-deps`: production bağımlılıkları
4. `runner`: slim runtime image

Önemli nokta:

- `VITE_*` değişkenleri build sırasında bundle içine gömülür
- `SUPABASE_SERVICE_ROLE_KEY` ve `ADMIN_PASSWORD` runtime secret olarak kalır
- Runtime konteyner `bun run server.mjs` ile ayağa kalkar

## 12. Güçlü Yönler

- SSR + özel Node sunucu kombinasyonu ile esnek mimari
- Public site ve admin panelin aynı repo/deploy içinde sade organizasyonu
- Supabase ile hızlı veri, auth ve storage entegrasyonu
- i18n desteğinin hem route hem içerik alanı seviyesinde düşünülmüş olması
- Admin işlemleri için merkezi bir API katmanı bulunması

## 13. Dikkat Edilmesi Gereken Noktalar

- Admin API tek dosyada büyüyor; kapsam arttıkça modülerleştirme ihtiyacı doğabilir
- Test altyapısı bulunmadığı için regresyon riski tamamen manuel doğrulamaya kalıyor
- Admin auth tek parola yaklaşımıyla çalışıyor; kişi bazlı yetki ve audit için yetersiz kalabilir
- Frontend'in bazı public veri okumaları doğrudan browser-Supabase erişimiyle yapılıyor; RLS kuralları dikkatle yönetilmeli
- `VITE_*` değişkenleri build-time olduğu için deploy sırasında environment yönetimi net yapılmalı

## 14. Özet

Bu repo, küçük/orta ölçekli bir mekan web sitesi için modern ama pragmatik bir full-stack kurgu sunuyor. Public deneyim SSR React ile, yönetim deneyimi ise özel Node admin API ile çözülmüş. Supabase projedeki veri omurgasını oluşturuyor; Bun, Vite ve TanStack Start ise geliştirme ve deploy akışını hafif tutuyor.

Kısacası mimari, hızla üretime çıkmak ve tek repo içinde hem vitrin hem operasyon paneli yürütmek için uygun; fakat bir sonraki ölçek adımında test, admin auth ve server-side modülerleşme tarafları en doğal geliştirme alanları olacaktır.
