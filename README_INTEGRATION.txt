PANDUAN INTEGRASI QIOSLINK (HOSTING)
=====================================

1. BUILD REACT APP
   - Jalankan perintah: `npm run build` di terminal komputer lokal Anda.
   - Folder bernama `dist` akan muncul.
   - Upload isi folder `dist` ini ke folder `public_html` di hosting Anda.

2. BUAT DATABASE
   - Masuk ke cPanel -> MySQL Databases.
   - Buat database baru, user baru, dan hubungkan user ke database.
   - Buka phpMyAdmin, import file SQL (lihat backend_php.txt bagian sql) untuk membuat tabel `users` dan `transactions`.

3. UPLOAD CALLBACK.PHP
   - Buka file `callback_php.txt` yang dihasilkan aplikasi ini.
   - Copy isinya, edit bagian config database ($host, $username, $password, $dbname).
   - Simpan sebagai `callback.php`.
   - Upload ke `public_html`.

4. SETTING QIOSPAY
   - Login ke qiospay.id
   - Masuk menu Integrasi.
   - Di kolom URL Callback, masukkan: https://nama-domain-anda.com/callback.php

5. UPLOAD FILE API LAINNYA (Opsional untuk Login Real)
   - Jika ingin login benar-benar konek ke database (bukan simulasi localStorage),
   - Anda perlu mengupload file `login.php` dan `create_payment.php` dari `backend_php.txt` sebelumnya.
   - Lalu edit kode React (`App.tsx`) bagian `handleLogin` untuk menggunakan `fetch('https://domain-anda.com/login.php'...)` daripada logika mock yang ada sekarang.

--------------------------------------------------------------------------------
F.A.Q (PERTANYAAN UMUM)
--------------------------------------------------------------------------------

Q: Apakah saya perlu modul tambahan (misal dari CPulsa/OtomaX)?
A: TIDAK PERLU. Aplikasi ini adalah "Custom Integration". Kode backend PHP yang kita buat
   sudah menangani semua logika komunikasi dengan Qiospay. Modul luar biasanya hanya untuk
   software server pulsa spesifik (OtomaX/IRS) dan tidak kompatibel dengan web custom ini.

Q: Bagaimana cara integrasi ke WHMCS?
A: Untuk WHMCS, Anda perlu membuat "Gateway Module" sederhana di WHMCS yang mengirim request
   ke API `create_payment.php` di aplikasi ini, atau langsung generate QR string.
