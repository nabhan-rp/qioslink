================================================================================
PANDUAN MIGRASI KE PRODUCTION (LIVE SERVER)
================================================================================

Saat ini aplikasi React berjalan di "Mode Demo" (Data disimpan di LocalStorage browser).
Agar aplikasi benar-benar menyimpan data ke Database Hosting, ikuti langkah ini:

--------------------------------------------------------------------------------
LANGKAH 1: PERSIAPAN DATABASE (cPanel)
--------------------------------------------------------------------------------
1. Login cPanel -> MySQL Databases.
2. Buat Database baru (misal: `u123_qioslink`).
3. Buat User Database baru (misal: `u123_admin`, pass: `rahasia`).
4. Add User To Database -> Centang "All Privileges".
5. Buka phpMyAdmin -> Pilih database tadi.
6. Klik menu "Import" -> Upload file `database.sql` yang ada di project ini.
   (File `database.sql` sudah saya buatkan, berisi tabel users & transactions).

--------------------------------------------------------------------------------
LANGKAH 2: PERSIAPAN BACKEND (PHP)
--------------------------------------------------------------------------------
1. Buka file `backend_php.txt` di project ini.
2. Ambil kode `db_connect.php`, edit bagian $host, $user, $pass, $dbname sesuai Langkah 1.
3. Ambil kode `create_payment.php` dan `callback.php`.
4. Upload file-file PHP tersebut ke folder `public_html` di Hosting Anda.

--------------------------------------------------------------------------------
LANGKAH 3: UPDATE FRONTEND (REACT) - INI KUNCI UTAMANYA!
--------------------------------------------------------------------------------
Codingan `App.tsx` saat ini masih pakai `localStorage`. Anda harus mengubah logika 
agar aplikasi "berbicara" dengan file PHP yang sudah diupload.

Contoh perubahan logika di `App.tsx`:

A. Saat Login (handleLogin):
   JANGAN: Cek array `users` dummy.
   GANTI JADI: 
   fetch('https://domain-anda.com/login.php', { method: 'POST', body: ... })
   
B. Saat Generate QR (handleGenerateQR):
   JANGAN: Simpan ke `transactions` state/localStorage.
   GANTI JADI:
   fetch('https://domain-anda.com/create_payment.php', { method: 'POST', body: ... })

*Jika Anda belum mahir React & API, Anda bisa menggunakan Mode Demo saja untuk Frontend, 
tapi gunakan "Integration API" (WHMCS/WooCommerce) untuk transaksi aslinya.*

--------------------------------------------------------------------------------
LANGKAH 4: BUILD & UPLOAD FRONTEND
--------------------------------------------------------------------------------
Setelah codingan React disesuaikan (atau jika ingin upload demo-nya saja):
1. Di terminal local: `npm run build`.
2. Buka folder `dist`.
3. Upload SEMUA isi folder `dist` ke `public_html` hosting Anda.
   (Campur saja dengan file PHP tadi, tidak masalah).

--------------------------------------------------------------------------------
STRUKTUR FILE DI HOSTING (PUBLIC_HTML) NANTI:
--------------------------------------------------------------------------------
/public_html
  ├── index.html          (Dari folder dist)
  ├── assets/             (Dari folder dist)
  ├── db_connect.php      (File PHP Koneksi)
  ├── create_payment.php  (File PHP API)
  ├── callback.php        (File PHP Webhook)
  ├── .htaccess           (Opsional, untuk routing React)
  └── ... file lainnya
