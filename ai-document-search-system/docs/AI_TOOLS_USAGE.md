# YZ Araç Kullanım Raporu
**AI Tools Usage Report**

Bu dokümantasyon, BİL440 Final Projesi kapsamında kullanılan YZ kod asistanlarının **hangi aşamada, neden ve nasıl** kullanıldığını detaylı biçimde açıklamaktadır.

---

## 📊 Kullanılan YZ Araçları Özeti

| YZ Aracı | Toplam Karar | Aşamalar | Güçlü Yönler | Zayıf Yönler |
|----------|--------------|----------|--------------|--------------|
| **Claude Code** | 16 | Analiz, Tasarım, Geliştirme, Test | Backend API design, RAG pipeline, Class-based yapı | Config versiyonları, Visual design evaluation |
| **Gemini** | 14 | Analiz, Tasarım, Geliştirme, Test | Clean code, Test generation, API structure | Tutarsız öneriler, React Query hallucination |
| **ChatGPT** | 10 | Analiz, Tasarım | BDD format, Frontend design philosophy, Color theory | - |
| **GitHub Copilot** | 8 | Geliştirme | Helper functions, NO_ANSWER_TEXT constant, Error handling | Hallucination (load_extracted_text), Overkill suggestions |

**TOPLAM:** 48 AI-assisted decision (Gereksinim: minimum 2 farklı araç ✅)

---

## 🔍 Aşama Bazında Detaylı Kullanım

### 1️⃣ **ANALİZ AŞAMASI** (Rows 3-8)

#### **Kullanılan Araçlar:** ChatGPT, Gemini, Claude Code

| YZ | Kullanım Amacı | Neden Seçildi | Nasıl Kullanıldı | Sonuç |
|----|----------------|---------------|------------------|-------|
| **ChatGPT** | PRD (Product Requirements Document) oluşturma | Yapılandırılmış doküman üretme becerisi | BİL440 PDF'i prompt olarak verildi, gereksinimler çıkarıldı | ✅ Kabul edildi |
| **Gemini** | Mimari yaklaşım önerileri | Sistem bileşenlerini tanımlama yeteneği | Frontend, Backend, LLM, Vector Store bileşenleri önerildi | ⚠️ Kısmen kabul (AI kullanım sınırları insan kararıyla netleştirildi) |
| **ChatGPT** | AI kullanım sınırlarının belirlenmesi | Etik ve teknik sınırlar konusunda farkındalık | "Hangi adımlarda AI kullanılmamalı?" sorusu soruldu | ✅ Kabul ama revize (PDF parsing, keyword search AI dışı bırakıldı) |
| **Gemini** | Test stratejisi tasarımı | Edge-case senaryoları oluşturma | Hallucination prevention, scanned PDF senaryoları önerildi | ✅ Kabul edildi |
| **ChatGPT** | GitHub branch stratejisi | Proje yönetimi deneyimi | Commit message standartları ([AI-generated], [AI-assisted], [Human-written]) önerildi | ✅ Kabul edildi |
| **Claude Code** | Mevcut dokümanların analizi | Kod okuma ve özet çıkarma | PRD, ARCHITECTURE, TEST_STRATEGY dokümanlarını okuyarak özet çıkardı | ✅ Kabul edildi |

**Kritik Karar - Row 5:**
❌ **ChatGPT'nin "AI tüm süreçte kullanılsın" önerisi reddedildi.**
**Gerekçe:** PDF parsing, keyword search, kaynak atfı deterministik işlemler, AI kullanımı gereksiz.
**İnsan Müdahalesi:** JOINT_DECISIONS.md dosyasında "AI Kullanılmayacak Alanlar" listesi oluşturuldu.

---

### 2️⃣ **TASARIM AŞAMASI** (Rows 9-26, 36-38)

#### **Kullanılan Araçlar:** Gemini, Claude Code, ChatGPT, GitHub Copilot

#### **Backend Tasarımı** (Rows 9-12)

| YZ | Kullanım Amacı | Neden/Nasıl | Sonuç |
|----|----------------|-------------|-------|
| **Gemini** | Backend klasör yapısı | Minimal services/ tabanlı yapı önerdi | ✅ Kabul (basit ve anlaşılır) |
| **Claude Code** | Katmanlı mimari | API versiyonlama (/api/v1/) önerdi | ✅ Kısmen kabul (versiyonlama kabul, katman ayrımı reddedildi) |
| **Gemini** | FastAPI endpoint yapısı | /upload, /search, /summarize, /qa endpoint'leri | ✅ Kabul + revize (Claude'un /api/v1/ prefix'i eklendi) |
| **Gemini, Claude, Copilot** | Python kütüphane seçimi | OpenAI, Anthropic, Gemini SDK önerildi | ❌ **HEPSİ REDDEDİLDİ** - Groq API seçildi (ücretsiz, hızlı) |

**Kritik Karar - Row 12:**
❌ **Üç AI'nın ücretli LLM SDK önerileri reddedildi.**
**Gerekçe:** OpenAI/Anthropic pahalı, Gemini rate limit kısıtlı, Groq ücretsiz katman daha uygun.
**İnsan Müdahalesi:** Maliyet-fayda analizi yapılarak Groq API seçildi.

#### **Frontend Tasarımı** (Rows 14-26)

| YZ | Kullanım Amacı | Neden/Nasıl | Sonuç |
|----|----------------|-------------|-------|
| **Gemini, ChatGPT, Copilot** | Framework seçimi | React + Vite önerildi | ✅ Üç AI de aynı fikir, kabul edildi |
| **Gemini, ChatGPT, Copilot** | State management | Context API vs Redux vs React Query | ⚠️ Copilot'un React Query önerisi **reddedildi** (overkill) |
| **ChatGPT** | API çağrısı yöntemi | Native fetch() önerdi | ✅ Kabul (Gemini ve Copilot'un React Query önerisi **reddedildi**) |
| **ChatGPT, Copilot** | UI Framework | Tailwind CSS önerildi | ✅ Kabul (Gemini'nin Material UI önerisi **reddedildi** - ağır) |
| **ChatGPT** | File upload UI | Native input + Custom drag & drop | ✅ Kabul (Gemini/Copilot'un react-dropzone önerisi **reddedildi** - 300kb+ gereksiz) |
| **Gemini, ChatGPT** | Arama UX | Enter + Button (debounce yok) | ✅ Kabul (backend ağır işlemler yapıyor, debounce uygun değil) |
| **Gemini, ChatGPT** | AI loading state | "Thinking..." + pulse animasyonu | ✅ Kabul (Copilot'un skeleton önerisi **reddedildi** - AI cevap uzunluğu belirsiz) |

**Kritik Kararlar:**
- **Row 15:** Copilot'un React Query önerisi **reddedildi** (proje küçük, server-state caching gereksiz)
- **Row 16:** Gemini'nin tutarsızlığı tespit edildi (Context API + React Query çelişiyor) → **AI hallucination**
- **Row 17:** Gemini'nin Material UI önerisi **reddedildi** (Tailwind yeterli)
- **Row 18:** Gemini ve Copilot'un react-dropzone önerisi **reddedildi** (native HTML yeterli)

#### **Renk Paleti ve Font Seçimi** (Rows 23, 26)

| YZ | Önerisi | Sonuç |
|----|---------|-------|
| **Gemini** | Indigo-Purple (AI temalı) | ❌ **Reddedildi** |
| **ChatGPT** | Klasik Mavi-Beyaz (akademik) | ❌ **Reddedildi** |
| **Copilot** | Klasik Mavi-Beyaz | ❌ **Reddedildi** |
| **İNSAN KARARI** | Ocean Blue + Sand (2025 trend) | ✅ **Seçildi** (AI önerilerinin ötesine geçilerek 2025 trendleri araştırıldı) |

**Kritik Karar - Row 23:**
❌ **Üç AI'nın renk önerileri de reddedildi.**
**Gerekçe:** AI'lar "klasik mavi" veya "modern indigo" ikilemine takıldı. 2025 trendleri (toprak tonları + doğa renkleri) daha uygun.
**İnsan Müdahalesi:** Sürdürülebilirlik ve güven mesajı veren Ocean Blue + Sand paleti seçildi.

**Kritik Karar - Row 26:**
❌ **Üç AI de "Inter" fontu önerdi, reddedildi.**
**Gerekçe:** Inter artık "varsayılan" hissettiriyor (herkes kullanıyor). Geist daha taze ve 2025 trendlerine uygun.
**İnsan Müdahalesi:** Vercel'in Geist fontu seçildi.

#### **Kullanıcı Hikayeleri** (Rows 36-38)

| YZ | Katkısı | Nasıl Kullanıldı |
|----|---------|------------------|
| **ChatGPT** | BDD formatı (Given/When/Then), öncelik belirleme | 7 user story, hallucination prevention kriteri ekledi |
| **Gemini** | Snippet View önerisi (arama sonuçlarında highlighted text) | UX enhancement önerisi |
| **Copilot** | Hata senaryoları | Timeout, geçersiz dosya, network failure error handling |
| **Claude Code** | Progress feedback, Score transparency | US-8 (progress bar), US-9 (explainability) |

**Hibrit Karar - Row 36:**
✅ **Dört AI'nın en iyi önerileri birleştirildi.**
**Sonuç:** 9 user story (4 Must Have, 2 Should Have, 3 Nice to Have)
**Yapı:** ChatGPT structure + Copilot error handling + Gemini UX + Claude explainability

---

### 3️⃣ **GELİŞTİRME AŞAMASI** (Rows 13, 21, 27-30, 34, 48-50)

#### **Backend Geliştirme** (Rows 13, 27-29)

| YZ | Kullanım Amacı | Neden/Nasıl | Sonuç |
|----|----------------|-------------|-------|
| **Gemini, Copilot, Claude** | LLM service implementation | Groq API integration, hallucination prevention | ✅ **HİBRİT** (3 AI'nın en iyi özellikleri birleştirildi) |
| **Gemini** | AI Router - Summarize endpoint | Clean code, try-except yapısı | ⚠️ Relative path hatası (`DATA_DIR` yerine `settings.extracted_dir` kullanılmalıydı) |
| **Copilot** | Helper functions, NO_ANSWER_TEXT constant | DRY principle, hallucination önleme | ⚠️ `load_extracted_text()` hallucination (fonksiyon yok) |
| **Claude Code** | RAG pipeline implementation | TF-IDF search → context build → LLM Q&A | ✅ Doğru path usage, empty text check |

**Kritik Karar - Row 13 (LLM Service):**
✅ **HİBRİT YAKLAŞIM** - Üç AI'nın gücü birleştirildi:
- **Gemini:** Doğru Groq API syntax (`client.chat.completions.create()`)
- **Copilot:** `NO_ANSWER_TEXT` constant (hallucination önleme), temperature=0.0 fikri
- **Claude:** Class-based yapı, variable temperature, strict system prompts

**AI Hallucination - Row 13:**
❌ **Copilot'un API kullanımı yanlış:** `client.generate()` metodu Groq SDK'da YOK!
**İnsan Müdahalesi:** Gemini'nin doğru syntax'ı kullanıldı.

#### **Frontend Geliştirme** (Rows 21, 30, 34)

| YZ | Kullanım Amacı | Sonuç |
|----|----------------|-------|
| **Claude Code** | Tailwind CSS 4.x kurulumu | ❌ **YANLIŞ** - Eski PostCSS config kullandı (breaking change) |
| **Claude Code** | Geist Font kurulumu | ❌ **HATA** - Race condition, dosya yazamadı |
| **Claude Code** | Ocean Blue + Sand UI implementation | ❌ **FELAKET** - Border görünmez, kartlar belli değil |
| **Claude Code** | Tüm frontend component'leri yeniden yazma | ✅ ChatGPT'nin tasarım çerçevesi doğrultusunda baştan yazıldı |

**Kritik Hatalar:**
- **Row 21:** Tailwind 4.x PostCSS plugin breaking change → **AI execution error #3**
- **Row 30:** Geist font file write race condition → **AI execution error #4**
- **Row 31:** UI tasarımı görsel felaket → **AI execution error #5**
- **Row 34:** Tüm frontend komple yeniden yazılma gerekti → **AI execution error #6**

**İnsan Müdahalesi:**
Kullanıcı, UI'ın stilsiz görünmesini fark edip `tailwind.config.js` sildi, `index.css`'i Tailwind 4.x formatına güncelledi.

#### **Text File Support** (Row 48)

| YZ | Kullanım Amacı | Sonuç |
|----|----------------|-------|
| **Claude Code** | Multi-format document support (.txt, .md) | ✅ Extension validation, conditional extraction, media type mapping |

---

### 4️⃣ **TEST AŞAMASI** (Rows 43, 46-47)

#### **Kullanılan Araçlar:** Gemini, Claude Code

| YZ | Kullanım Amacı | Neden/Nasıl | Sonuç |
|----|----------------|-------------|-------|
| **Gemini** | Test senaryosu üretimi | Edge-case scenarios (hallucination, scanned PDF, large docs) | ✅ 6 senaryo kabul, 2 red, 2 düzeltme |
| **Gemini** | PDF service unit test | PyMuPDF mocking | ❌ **HATA:** Mock iterator eksik (`__len__`, `__getitem__`) → **AI execution error #14** |
| **Gemini** | LLM service test | Client patching | ❌ **HATA:** Global variable varsayımı, `@patch` yanlış → **AI execution error #15** |

**Kritik Kararlar - Row 43:**
- ✅ **Kabul:** `test_summarize_short`, `test_qa_factual`, `test_hallucination_prevention`, `test_empty_input`, `test_api_error_handling`
- ❌ **Red:** Copilot'un `test_real_api_call` (canlı API testi - izole değil)
- ❌ **Red:** Gemini'nin `test_summary_in_french` (kapsam dışı - scope creep)
- ⚠️ **Düzeltme:** Gemini'nin `pytest-groq` hallucination (böyle bir kütüphane yok)

**AI Execution Errors:**
- **Row 46:** PDF mock'u iterable yapılmadı → İnsan müdahalesiyle düzeltildi
- **Row 47:** Client patching yanlış (`patch.object` kullanılmalıydı) → İnsan müdahalesiyle düzeltildi

---

### 5️⃣ **DEPLOYMENT & BUG FIXES** (Rows 39-42, 44-45, 50)

#### **Runtime Hatalar ve Düzeltmeler**

| Row | YZ | Hata | İnsan Müdahalesi |
|-----|-----|------|------------------|
| **39** | Claude | Tab navigation pattern inconsistency | ❌ **AI execution error #8** - activeTab state eksik |
| **40** | Claude | Download endpoint eksik | ❌ **AI execution error #9** - CRUD incomplete |
| **41** | Claude | Summarize butonu placeholder | ❌ **AI execution error #10** - Incomplete feature |
| **42** | Gemini, Copilot, Claude | Decommissioned Groq model (`llama3-8b-8192`) | ❌ **AI execution error #11** - Deprecation tracking yok |
| **44** | Claude | Model update sadece `config.py`, `.env` unutuldu | ❌ **AI execution error #12** - Environment variable override |
| **45** | Hibrit | Duplicate schema (`QASource` vs `Source`) | ❌ **AI execution error #13** - Merge conflict |
| **50** | Claude | BulkSummarize API response handling | ❌ **AI execution error #16** - API contract check eksik |

---

## 📈 YZ Araçlarının Güçlü ve Zayıf Yönleri

### **Claude Code**
✅ **Güçlü Yönler:**
- Backend API design (class-based yapı, RAG pipeline)
- Dosya okuma ve kod analizi
- Strict prompt engineering (hallucination prevention)

❌ **Zayıf Yönler:**
- Framework version değişiklikleri (Tailwind 4.x breaking change)
- Visual design evaluation (renk tonlarını göremiyor)
- File write race conditions (HMR/auto-save conflict)
- Config file compatibility (`.env` override unutma)

---

### **Gemini**
✅ **Güçlü Yönler:**
- Clean code structure
- Test scenario generation
- API error handling

❌ **Zayıf Yönler:**
- Tutarsız öneriler (Context API + React Query çelişkisi)
- Hallucination (non-existent libraries: `pytest-groq`)
- Relative path kullanımı (best practices ihlali)

---

### **ChatGPT**
✅ **Güçlü Yönler:**
- BDD format (Given/When/Then)
- Frontend design philosophy
- Scope creep awareness (gereksiz özellikler reddediyor)

❌ **Zayıf Yönler:**
- Implementation detayları eksik (sadece high-level öneriler)

---

### **GitHub Copilot**
✅ **Güçlü Yönler:**
- Helper functions ve constants (NO_ANSWER_TEXT)
- Error handling scenarios
- DRY principle

❌ **Zayıf Yönler:**
- Hallucination (non-existent functions: `load_extracted_text()`)
- Overkill suggestions (React Query, react-dropzone)
- Proje ölçeğini yanlış değerlendirme

---

## 🎯 Sonuç ve Öğrenilen Dersler

### **AI'ların Başarılı Olduğu Alanlar:**
1. ✅ Boilerplate kod üretimi (FastAPI router, React components)
2. ✅ Test senaryosu oluşturma (edge cases)
3. ✅ Pattern önerileri (RAG pipeline, class-based services)
4. ✅ Error handling yaklaşımları

### **AI'ların Başarısız Olduğu Alanlar:**
1. ❌ Framework version tracking (breaking changes)
2. ❌ Visual design evaluation (renk tonları, spacing)
3. ❌ Pattern consistency (tab navigation farklı implement edilmesi)
4. ❌ API deprecation/versioning (decommissioned models)
5. ❌ Scope awareness (overkill suggestions)

### **İnsan Müdahalesinin Kritik Olduğu Noktalar:**
1. 🔍 **Maliyet-fayda analizi** (Groq vs OpenAI/Anthropic)
2. 🔍 **Görsel test** (UI tasarımı tarayıcıda kontrol)
3. 🔍 **Tutarlılık kontrolü** (AI'ların çelişen önerileri)
4. 🔍 **Kapsam yönetimi** (scope creep prevention)
5. 🔍 **Deprecation takibi** (API changelog manual check)

---

## 📝 Özet İstatistikler

| Metrik | Değer |
|--------|-------|
| Toplam AI Kararları | 48 |
| Kabul Edilen AI Önerileri | 28 (58%) |
| Reddedilen AI Önerileri | 10 (21%) |
| Hibrit (Birleştirilmiş) Kararlar | 10 (21%) |
| Tespit Edilen AI Execution Errors | 16 |
| Kullanılan Farklı YZ Araç Sayısı | 4 (Gereksinim: 2) |

**SONUÇ:** Proje, YZ araçlarını **bilinçli, eleştirel ve belgelenmiş** biçimde kullanmıştır. Her aşamada en az 2 farklı YZ kullanılmış, her aracın güçlü/zayıf yönleri tespit edilmiş ve gerektiğinde AI önerileri reddedilmiştir.

---

**Hazırlayan:** BİL440 Final Projesi
**Tarih:** Ocak 2026
**Proje:** AI Document Search System (Proje #2)
