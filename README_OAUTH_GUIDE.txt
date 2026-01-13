
================================================================================
PANDUAN INTEGRASI SOCIAL LOGIN (OAUTH)
================================================================================

QiosLink v4.8 mendukung login menggunakan Google, Facebook, dan GitHub.
Fitur ini bekerja dengan metode "Client-Side Token Verification".

--------------------------------------------------------------------------------
1. PERSIAPAN DI SISI BACKEND (PHP)
--------------------------------------------------------------------------------
Pastikan file `social_login.php` dari bundle terbaru sudah diupload ke folder `/api/`.
File ini yang akan menerima data user dari Frontend dan mendaftarkannya ke database MySQL.

--------------------------------------------------------------------------------
2. CARA MENDAPATKAN CLIENT ID
--------------------------------------------------------------------------------

A. GOOGLE LOGIN
1. Buka Google Cloud Console: https://console.cloud.google.com/
2. Buat Project Baru.
3. Masuk ke "APIs & Services" -> "Credentials".
4. Klik "Create Credentials" -> "OAuth Client ID".
5. Pilih "Web Application".
6. Masukkan "Authorized JavaScript Origins": 
   - `https://domain-anda.com` (Untuk Production)
   - `http://localhost:5173` (Untuk Development)
7. Copy "Client ID" dan paste di Dashboard QiosLink -> Settings -> Auth.

B. GITHUB LOGIN
1. Buka GitHub Developer Settings: https://github.com/settings/developers
2. New OAuth App.
3. Homepage URL: `https://domain-anda.com`
4. Authorization callback URL: `https://domain-anda.com/` (Karena kita pakai SPA/Popup).
5. Copy "Client ID" dan "Client Secret".

C. FACEBOOK LOGIN
1. Buka Meta for Developers: https://developers.facebook.com/
2. Create App -> Pilih tipe "Consumer" atau "Business".
3. Tambahkan produk "Facebook Login".
4. Settings -> Basic -> Copy "App ID".

--------------------------------------------------------------------------------
3. KONFIGURASI DI QIOSLINK
--------------------------------------------------------------------------------
1. Login sebagai Superadmin.
2. Masuk ke Menu "Settings & Profile".
3. Klik Tab "Auth & Security".
4. Scroll ke bagian "Social Login".
5. Aktifkan provider yang diinginkan dan masukkan Client ID yang didapat dari langkah 2.
6. Klik "Save Security Settings".

--------------------------------------------------------------------------------
CATATAN TEKNIS
--------------------------------------------------------------------------------
- User yang login via Social Auth tidak memiliki password di database (`password` = NULL).
- Jika email dari Google sama dengan email user yang sudah ada, sistem akan otomatis melakukan "Link Account".
- Pastikan website Anda menggunakan HTTPS agar OAuth berfungsi normal.
