# Joint Team Decisions (Kilit Proje Kararları)

Bu doküman, Akıllı Doküman Arama & Özetleme Sistemi projesi kapsamında
ekip tarafından ortak alınan ve tüm geliştirme sürecini bağlayan
nihai kararları içerir.

Bu kararlar, hem backend geliştirme sürecini hem de rapor ve sunum
içeriğini doğrudan bağlayıcıdır.

---

## 1. AI Kullanım Sınırları (Nihai Karar)

AI yalnızca anlamsal yorum ve doğal dil üretimi gerektiren adımlarda
kullanılacaktır. Deterministik ve doğrulanabilir işlemler bilinçli
olarak AI dışı bırakılmıştır.

| Sistem Adımı | AI Kullanımı | Nihai Karar |
|------------|-------------|------------|
| PDF → Metin çıkarımı | ❌ Hayır | PyMuPDF (deterministik) |
| Doküman saklama | ❌ Hayır | Local FS + JSON |
| Keyword search | ❌ Hayır | TF-IDF |
| Embedding | ⚠️ Kısmen | Sentence-Transformers |
| Özetleme | ✅ Evet | ChatGPT |
| Soru–Cevap | ✅ Evet | Claude / Gemini |
| Kaynak atfı | ❌ Hayır | Kural tabanlı |

**Raporda kullanılacak ifade:**

> “AI, yalnızca anlamsal yorum ve dil üretimi gerektiren adımlarda kullanılmış;
deterministik ve doğrulanabilir işlemler bilinçli olarak AI dışı bırakılmıştır.”

---

## 2. Bilinçli Yanlış / Eksik AI Çıktısı Senaryosu

### Senaryo Tanımı
Kullanıcı, yüklenen dokümanlarda hiç geçmeyen bir kavram hakkında
soru sorar.

### AI Davranışı
LLM, bağlam yetersizliğine rağmen genel bilgisine dayanarak cevap üretir
(hallucination).

### Sistem Tepkisi (İnsan Kontrollü)
- Cevap için doküman kaynak atfı yapılamaz
- Kullanıcıya uyarı gösterilir:

> “Bu cevap, yüklenen dokümanlara dayanmıyor olabilir.”

### Amaç
Bu senaryo, AI’nin bağlam dışı genelleme yapabilme riskini
bilinçli olarak gözlemlemek ve raporlamak için tasarlanmıştır.

---

## 3. Versiyonlama ve Commit Politikası

AI katkısı olan tüm kodlar GitHub commit mesajlarında açıkça etiketlenecektir.

| İçerik | Commit Etiketi |
|------|---------------|
| PDF parsing | [Human-written] |
| Keyword search | [Human-written] |
| Embedding logic | [AI-assisted] |
| RAG orchestration | [AI-assisted] |
| Özetleme promptları | [AI-generated] |
| Test senaryoları | [AI-generated] |

**Raporda kullanılacak ifade:**

> “AI katkısı olan her kod parçası, versiyon kontrol sisteminde açıkça etiketlenmiştir.”
