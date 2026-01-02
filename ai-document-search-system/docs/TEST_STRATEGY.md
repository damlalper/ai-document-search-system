# Test Strategy

Bu doküman, Akıllı Doküman Arama ve Özetleme Sistemi için test yaklaşımını özetler.
Amaç; sistemin doğruluğunu test etmek kadar, yapay zekânın **yanılabildiği durumları bilinçli biçimde ortaya koymaktır**.

## Test Seviyesi
- Sistem Testi (backend API + AI bileşenleri birlikte)

## Test Türleri

### 1. Unit Testler (AI-assisted)
- PDF yükleme sonrası metin çıkarımı
- Embedding oluşturma
- Retrieval (ilgili chunk seçimi)

### 2. Edge-Case Senaryoları
- Çok uzun doküman
- Belirsiz / çok genel kullanıcı sorusu
- Dokümanda cevabı olmayan soru

### 3. Bilinçli Yanlış AI Çıktısı
Aşağıdaki senaryolardan en az biri **bilinçli olarak üretilecek ve raporlanacaktır**:
- AI’nin dokümanda olmayan bir bilgiyi uydurması (hallucination)
- Yanlış dokümana kaynak atfetmesi
- Aşırı genelleştirilmiş özet üretmesi

Bu hatalar:
- Loglanacak
- AI Decision Log’da belirtilecek
- Teknik raporda nedenleriyle tartışılacaktır
