# AKILLI DOKÜMAN ARAMA VE ÖZETLEME SİSTEMİ

## Product Requirements Document (PRD) – Final Versiyon

---

## 1. Genel Bilgiler ve Bağlam

**Ders:** BİL440 – YZ Destekli Yazılım Geliştirme (2025–26 Güz)
**Kurum:** İzmir Bakırçay Üniversitesi, Bilgisayar Mühendisliği Bölümü
**Proje Teması:** AI‑Augmented Software Lifecycle Project
**Proje Türü:** Web Tabanlı Yazılım Sistemi
**Son Teslim Tarihi:** 18/01/2026

Bu doküman, BİL440 dersi kapsamında geliştirilecek **Akıllı Doküman Arama ve Özetleme Sistemi**nin kapsamını, hedeflerini, gereksinimlerini ve yapay zekâ destekli geliştirme yaklaşımını tanımlar.

---

## 2. Projenin Temel Felsefesi (Mühendis Refleksi)

Bu projenin amacı yalnızca çalışan bir yazılım üretmek değil; **yapay zekâ ile birlikte düşünülmüş, sorgulanmış ve gerekçelendirilmiş** bir yazılım geliştirme sürecini ortaya koymaktır.

Projede geliştiricilerden beklenen temel mühendislik refleksleri:

* YZ ile sadece kod yazan değil, **YZ ile yazılım geliştiren** bir yaklaşım benimsemek
* YZ önerilerini eleştirel biçimde değerlendirmek; gerektiğinde **reddedebilmek veya değiştirebilmek**
* YZ’nin güçlü olduğu ve yanıltıcı olabildiği noktaları **açıkça ayırt edebilmek**

Bu refleksler; **AI Decision Log**, mimari karar açıklamaları ve **bilinçli olarak raporlanan hatalı YZ çıktıları** ile somutlaştırılacaktır.

---

## 3. Seçilen Proje

**Proje #2 – Akıllı Doküman Arama ve Özetleme Sistemi**

Bu proje kapsamında, kullanıcıların yüklediği dokümanlar üzerinde arama yapabilen, bağlama duyarlı özetler üretebilen ve doğal dilde sorulara yalnızca doküman içeriğine dayalı cevaplar verebilen web tabanlı bir sistem geliştirilecektir.

### 3.1 Hedef Kullanıcı Profili

Sistem; akademik makaleler, ders notları veya teknik dokümanlar üzerinde çalışan öğrenciler ve araştırmacılar için tasarlanmıştır. Kullanıcılar, yükledikleri dokümanlardan hızlı biçimde bilgiye ulaşmak ve içerikleri özetlenmiş halde incelemek istemektedir.

---

## 4. Temel Gereksinimler

### 4.1 Doküman Yönetimi

* Kullanıcı tarafından **PDF veya metin dosyalarının** sisteme yüklenebilmesi
* Yüklenen dokümanların sistem içerisinde saklanması
* Dokümanlara sonradan tekrar erişilebilmesi

### 4.2 Arama Mekanizması

* Doküman içeriği üzerinde **anahtar kelimeye dayalı (keyword‑based)** geleneksel arama yapılabilmesi

### 4.3 Fonksiyonel Olmayan Gereksinimler

* Sistem, tek kullanıcı senaryosunda makul sürede (birkaç saniye içinde) yanıt üretebilmelidir
* Yüklenen doküman boyutu için makul bir üst sınır tanımlanacaktır
* Sistem, yanlış veya eksik YZ çıktılarının kullanıcıyı yanıltmaması için açıklayıcı uyarılar sunabilir

---

## 5. Zorunlu Akıllı Davranışlar

Bu proje, dokümanlara dayalı bilgi üretimi için **RAG (Retrieval‑Augmented Generation)** yaklaşımını temel alır.

### 5.1 Doğal Dil Soru‑Cevap

* Kullanıcının doğal dilde sorduğu sorulara, **yalnızca yüklenen doküman içeriğine dayalı** cevaplar üretilmelidir

### 5.2 Kaynak Atfı

* Üretilen her cevabın hangi doküman(lar)a dayandığı açıkça belirtilmelidir
* Kaynak atfı; doküman adı ve ilgili bölüm/paragraf referansı şeklinde sunulmalıdır

### 5.3 Özetleme

Her doküman için:

* **Kısa özet**
* Kullanıcı isteğine bağlı **detaylı özet** üretilmelidir

### 5.4 Hata Farkındalığı

* En az bir **yanlış veya eksik YZ çıktısı** bilinçli olarak tespit edilmeli
* Bu çıktı teknik raporda nedenleriyle birlikte belgelenmelidir

---

## 6. YZ Kullanım Yaklaşımı ve Sınırları

### 6.1 AI Destekli Karar Süreci

Analiz, tasarım, geliştirme, test ve değerlendirme aşamalarında LLM’ler;

* Alternatif çözüm üretimi
* Risk ve hata analizi
* Mimari ve tasarım seçeneklerinin karşılaştırılması

amaçlarıyla kullanılacaktır.

Tüm kritik kararlar, **AI Decision Log** üzerinden *"YZ önerisi / insan kararı"* ayrımıyla belgelenecektir.

### 6.2 YZ Kullanım Sınırı (Prensip)

Deterministik ve doğrulanabilir işlemlerde (dosya yükleme, saklama, PDF’ten metin çıkarımı, anahtar kelime araması vb.) LLM kullanımının fayda‑maliyet ve hata riski açısından gerekçelendirilmesi esastır.

Bu tür adımlarda öncelik klasik yazılım yöntemleridir; LLM’ler yalnızca açık bir kazanım sağladığı ve çıktılar doğrulanabildiği durumlarda tercih edilecektir.

---

## 7. Yazılım Geliştirme Yaşam Döngüsü (SDLC)

Proje; **Analiz, Tasarım, Geliştirme, Test ve Değerlendirme** aşamalarının tamamını kapsayacaktır.

Bu süreçlerde en az **iki farklı YZ kod asistanı** (ör. ChatGPT, GitHub Copilot, Claude Code, Gemini Code Assist) kullanılacaktır.

YZ araçlarının hangi aşamada, hangi amaçla ve neden kullanıldığı teknik raporda açıkça belirtilecektir.

---

## 8. Tasarım Çıktıları

* **Kullanıcı Hikâyeleri:** YZ destekli (AI‑assisted)
* **UML Diyagramı:** Sistemi açıklayan en az bir diyagram (örn. Component veya Class Diagram)
* **Mimari Kararlar:**

  * AI önerisi
  * İnsan kararı
    ayrımı net biçimde yapılacaktır

---

## 9. Geliştirme ve Versiyonlama

* Tüm kodlar GitHub üzerinden teslim edilecektir
* Commit mesajlarında aşağıdaki etiketlerden biri yer alacaktır:

  * `[AI-generated]`
  * `[AI-assisted]`
  * `[Human-written]`

Açıklaması yapılmayan AI‑generated kodlar puan kaybına sebep olacaktır.

---

## 10. Test ve Hata Ayıklama

* Unit testler ve edge‑case senaryoları YZ yardımıyla oluşturulacaktır
* En az bir yanlış veya eksik YZ çıktısı:

  * bilinçli olarak tetiklenecek
  * teknik olarak analiz edilecek
  * raporda belgelenecektir

---

## 11. Dokümantasyon ve Raporlama

### 11.1 AI Decision Log (Zorunlu)

Her kritik karar aşağıdaki tabloyla belgelenecektir:

| Aşama | Kullanılan YZ | YZ Önerisi | Nihai Karar | Gerekçe |

Bu tablo, YZ’nin kod yazma rolünü değil; **karar alma sürecindeki etkisini** belgelemeyi amaçlar.

### 11.2 Etik, Güvenlik ve Lisans

Raporda aşağıdaki başlıklar ayrı bir bölümde tartışılacaktır:

* Kod lisansı riski
* Veri gizliliği
* Güvenlik açıkları
* AI hallucination örnekleri

---

## 12. Kapsam Dışı (Out of Scope)

* Production seviyesinde güvenlik ve ölçeklenebilirlik
* Gerçek zamanlı çoklu kullanıcı desteği
* Büyük ölçekli vektör veritabanları

---

## 13. Başarı Kriterleri

Projenin başarılı sayılabilmesi için:

* Dokümanlara dayalı soru‑cevap üretilebilmesi
* Kısa ve detaylı özetlerin üretilebilmesi
* En az bir hatalı YZ çıktısının tespit edilip raporlanması
* AI Decision Log’un eksiksiz doldurulması
* AI tarafından önerilen ancak insan tarafından reddedilen en az bir kararın belgelenmesi
* Geliştirme sürecinin açıklanabilir olması

---

## 14. Yasaklar ve Net Kurallar

* YZ çıktıları doğrudan kopyalanamaz
* Prompt paylaşılmadan yapılan AI iddiaları geçersizdir
* Kodun neden çalıştığını açıklayamayan grup başarılı sayılmaz
