import { createFileRoute } from "@tanstack/react-router";
import turtle from "@/assets/turtle.jpg";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hikayemiz — Dragoman Bahçe" },
      { name: "description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
      { property: "og:title", content: "Hikayemiz — Dragoman Bahçe" },
      { property: "og:description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="px-5 pt-8">
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-elegant">
        <img src={turtle} alt="Kaş kıyıları" className="w-full aspect-[4/5] object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-script text-3xl text-gold">Dragoman</p>
          <p className="text-foreground/90 text-sm mt-1">
            "Tercüman" demek — iki dünya arasında köprü kuran.
          </p>
        </div>
      </div>

      <div className="mb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/55">Hikayemiz</p>
      </div>

      <div className="space-y-4 text-foreground/85 text-[15px] leading-relaxed">
        <p className="text-lg text-foreground">
          Kaş'ın merkezinde, kalabalığın bir adım gerisinde saklı bir bahçeyiz biz.
          Gürültünün değil, sohbetin yükseldiği; gösterişin değil, samimiyetin değer
          gördüğü bir yer kurmak istedik. Çünkü biz de bir zamanlar bu sokaklarda
          dolaşan, doğru müziği, doğru insanları ve doğru hissi arayanlardandık.
        </p>
        <p>
          Benim hikâyem aslında masa başında başladı. Beyaz yakalı hayatın düzenli ama
          ruhsuz döngüsünden çıkıp, hayatın gerçekten yaşandığı yere dönmek istedim.
          Kaş zaten hep içimdeydi. Denizle, doğayla, insanla kurulan o sade ama güçlü
          bağ... Sonra bir gün dedim ki: "Ya şimdi, ya hiç." Ve biz bu bahçeyi kurduk.
        </p>
        <p>
          Burası aslında sadece bir işletme değil; bir kaçış. Eski Kaş evlerinin arka
          bahçelerinde saklı olan o sürpriz hissi yaşatmak istedik. İnsan içeri
          girdiğinde "ben burayı nasıl daha önce keşfetmedim?" desin istedik. Çünkü
          Kaş'ın en güzel tarafı biraz gizli olmasıdır. Biz de o gizli kalan
          güzelliklerden biri olmayı seçtik.
        </p>
        <p>
          Müzik bizim için dekor değil, ruhun kendisi. Rock, soul, blues... Bazen
          akustik canlı performanslar... Haftanın birkaç günü sahne kuruyoruz ama her
          gün bir hikâye var burada. Çünkü biz müziği fon olarak değil, bağ kurmak için
          kullanıyoruz.
        </p>
        <p>
          Menüye gelirsek... Büyük iddialarımız yok ama küçük detaylara çok takığız.
          Kokteyl yapıyorsak gerçekten içilsin diye yapıyoruz. Hamburger yapıyorsak,
          "en iyisi bu mu?" diye kendimize sorarak yapıyoruz. Gelen insanların
          "burada her şey olması gerektiği gibi" demesi bizim için en büyük ödül.
          Zaten misafirlerimiz çoğu zaman bunu söylüyor: Burada insan kendini yabancı
          gibi hissetmiyor.
        </p>
        <p>
          Bir de şu var... Biz müşteri istemiyoruz. Biz misafir istiyoruz. Çünkü bu
          bahçede kurduğumuz şey aslında bir işletme değil, bir his. İnsanların tekrar
          tekrar gelmesinin sebebi de bu: burada kimse yalnız değil.
        </p>
        <p>
          Dragoman Bahçe'nin bir diğer hikâyesi de köklerinden geliyor. Yıllardır
          Kaş'ta denizle, doğayla iç içe olan Dragoman kültürünün bir parçasıyız.
          Dalıştan gelen o özgürlük hissini, bu bahçeye taşıdık. Bu yüzden burası biraz
          da dalışçıların, gezginlerin, hayatı biraz daha derin yaşayanların buluşma
          noktası.
        </p>
        <p>
          Biz büyük olmak istemedik. Zincir olmak istemedik. Franchise hiç düşünmedik.
          Çünkü bu yerin ruhu kopyalanamaz. Her akşam burada kurulan masa, edilen
          sohbet, çalınan şarkı... hepsi biricik.
        </p>
        <p>
          Eğer bir gün yolun Kaş'a düşerse, bizi bulmak için tabelalara bakmana gerek
          yok. İçgüdünü takip et. Kalabalıktan biraz uzaklaş. Bir kapıdan gir, belki
          bir avlu, belki bir bahçe...
        </p>
        <p className="text-foreground">Muhtemelen biz oradayız.</p>
      </div>
    </div>
  );
}
