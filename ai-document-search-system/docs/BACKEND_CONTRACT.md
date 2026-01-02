# Backend Development Contract

Bu doküman, backend ve AI katmanını geliştirecek kişi için
bağlayıcı teknik varsayımları ve sınırları tanımlar.

Amaç: Yanlış AI kullanımı ve scope dışı geliştirmeleri önlemek.

---

## 1. Genel Mimari Varsayımlar

- Backend: FastAPI
- Programlama dili: Python 3.11+
- Monolitik ama modüler yapı
- Cloud deployment YOK

---

## 2. AI Kullanım Kuralları

### AI KULLANILMAYACAK:
- PDF parsing
- Text cleaning
- Chunking (kural tabanlı)
- Keyword search
- Kaynak atfı

### AI KULLANILACAK:
- Doküman özetleme
- Doğal dil soru-cevap

Bu kurallar `JOINT_DECISIONS.md` ile bağlayıcıdır.

---

## 3. RAG Pipeline Beklentisi

- Chunking: Sayfa veya paragraf bazlı
- Retrieval:
  - TF-IDF (zorunlu)
  - Embedding (opsiyonel)
- Context → LLM prompt

Hazır framework (LangChain, LlamaIndex) KULLANILMAYACAK.

---

## 4. API Çıkış Beklentileri (Örnek)

### /search
```json
{
  "query": "string",
  "results": [
    {
      "doc_id": "string",
      "score": 0.82
    }
  ]
}

/summarize
{
  "doc_id": "string",
  "summary": "string"
}

/qa
{
  "question": "string",
  "answer": "string",
  "sources": []
}
```

## 5.Test Beklentisi

pytest kullanılacak

En az 1 hallucination senaryosu test edilecek

Boş doküman ve alakasız soru testleri bulunacak
