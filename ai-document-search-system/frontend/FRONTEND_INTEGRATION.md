# Frontend Integration Guide

Bu dosya, frontend geliştirme ekibinin backend API'ye nasıl bağlanacağını gösterir.

## Backend Kurulumu

1. Backend'i başlat:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

2. API şu adreste çalışacak: `http://localhost:8000`

3. API dokümantasyonu: `http://localhost:8000/docs` (Swagger UI)

## Çalışan API Endpoint'leri

### 1. Health Check

**GET** `/` veya `/health`

```javascript
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log(data)); // {"status": "healthy"}
```

---

### 2. PDF Yükleme

**POST** `/api/v1/documents/upload`

```javascript
const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};

// Kullanım
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await uploadPDF(file);
  console.log(result);
  // {
  //   "doc_id": "123e4567-e89b-12d3-a456-426614174000",
  //   "filename": "example.pdf",
  //   "status": "success",
  //   "uploaded_at": "2024-01-02T10:30:00"
  // }
});
```

---

### 3. Döküman Listesi

**GET** `/api/v1/documents`

```javascript
const listDocuments = async () => {
  const response = await fetch('http://localhost:8000/api/v1/documents');
  return await response.json();
};

// Kullanım
const docs = await listDocuments();
console.log(docs);
// {
//   "documents": [
//     {
//       "doc_id": "123e4567-e89b-12d3-a456-426614174000",
//       "filename": "example.pdf",
//       "uploaded_at": "2024-01-02T10:30:00",
//       "page_count": 10,
//       "file_size": 204800
//     }
//   ],
//   "total": 1
// }

// UI'da listeleme
docs.documents.forEach(doc => {
  console.log(`${doc.filename} - ${doc.page_count} pages`);
});
```

---

### 4. Tekil Döküman Bilgisi

**GET** `/api/v1/documents/{doc_id}`

```javascript
const getDocument = async (docId) => {
  const response = await fetch(`http://localhost:8000/api/v1/documents/${docId}`);
  return await response.json();
};

// Kullanım
const doc = await getDocument('123e4567-e89b-12d3-a456-426614174000');
console.log(doc.filename, doc.page_count);
```

---

### 5. Döküman Silme

**DELETE** `/api/v1/documents/{doc_id}`

```javascript
const deleteDocument = async (docId) => {
  const response = await fetch(`http://localhost:8000/api/v1/documents/${docId}`, {
    method: 'DELETE',
  });
  return await response.json();
};

// Kullanım
await deleteDocument('123e4567-e89b-12d3-a456-426614174000');
// { "status": "success", "message": "Document ... deleted successfully" }
```

---

### 6. Arama (TF-IDF, Klasik Yöntem - AI YOK)

**POST** `/api/v1/search`

```javascript
const searchDocuments = async (query, topK = 5) => {
  const response = await fetch('http://localhost:8000/api/v1/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      top_k: topK,
    }),
  });

  return await response.json();
};

// Kullanım
const results = await searchDocuments('machine learning', 5);
console.log(results);
// {
//   "query": "machine learning",
//   "results": [
//     {
//       "doc_id": "123e4567-e89b-12d3-a456-426614174000",
//       "filename": "ml_paper.pdf",
//       "score": 0.8523,
//       "snippet": "...machine learning algorithms are widely used..."
//     }
//   ],
//   "total_found": 1
// }

// UI'da sonuçları göster
results.results.forEach(result => {
  console.log(`${result.filename} (Score: ${result.score})`);
  console.log(`Snippet: ${result.snippet}`);
});
```

---

## Henüz Tamamlanmayan Endpoint'ler

Aşağıdaki endpoint'ler henüz implement edilmedi (AI router - `ai.py`):

### 🚧 Özetleme (Summarization)

**POST** `/api/v1/ai/summarize` - *Henüz yok*

Planlanan request:
```json
{
  "doc_id": "123e4567-e89b-12d3-a456-426614174000",
  "summary_type": "short" // veya "detailed"
}
```

### 🚧 Soru-Cevap (Q&A)

**POST** `/api/v1/ai/qa` - *Henüz yok*

Planlanan request:
```json
{
  "question": "What is the main conclusion?",
  "doc_ids": ["123e4567-e89b-12d3-a456-426614174000"] // optional
}
```

---

## CORS Ayarları

Backend şu anda **tüm originlere** izin veriyor (`allow_origins=["*"]`). Production'da değiştirilecek.

Frontend `localhost:3000`, `localhost:5173` vb. portlardan sorunsuz bağlanabilir.

---

## Hata Yönetimi

API hataları HTTP status code'ları ile dönüyor:

```javascript
try {
  const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.detail); // Hata mesajı
  }
} catch (error) {
  console.error('Network error:', error);
}
```

Yaygın hatalar:
- `400 Bad Request` - Geçersiz input (ör: PDF olmayan dosya)
- `404 Not Found` - Döküman bulunamadı
- `500 Internal Server Error` - Backend hatası

---

## Örnek React Component

```jsx
import { useState } from 'react';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Uploaded: ${result.filename}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
    </div>
  );
}

export default DocumentUpload;
```

---

## Test Senaryoları

1. **PDF Yükleme Testi:**
   - PDF dosyası seç ve upload et
   - `doc_id` döndüğünü kontrol et

2. **Arama Testi:**
   - En az 1 PDF yükle
   - Arama yap ve sonuç geldiğini kontrol et

3. **Döküman Listeleme:**
   - Yüklenen dökümanların listede göründüğünü kontrol et

4. **Döküman Silme:**
   - Bir dökümanı sil
   - Listeden kaybolduğunu kontrol et

---

## OpenAPI Dokümantasyonu

Tüm endpoint'lerin interaktif dokümantasyonu:

**Swagger UI:** http://localhost:8000/docs

Burada:
- Her endpoint'i test edebilirsin
- Request/response şemalarını görebilirsin
- "Try it out" ile canlı API çağrısı yapabilirsin

---

## Sorular?

Backend geliştirici (Kişi A) ile iletişime geç veya Swagger UI'dan test yap!
