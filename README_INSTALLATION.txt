================================================================================
QIOSLINK - PANDUAN INSTALASI LENGKAP
================================================================================

Aplikasi ini terdiri dari dua bagian:
1. FRONTEND (Tampilan Web) - Dibuat dengan React.
2. BACKEND (Logika Server) - Dibuat dengan PHP (karena Anda menggunakan Shared Hosting).

--------------------------------------------------------------------------------
A. CARA TEST DI LOCALHOST (Preview Sebelum Upload)
--------------------------------------------------------------------------------

1. FRONTEND PREVIEW
   - Jika Anda menggunakan AI Studio/StackBlitz, cukup lihat panel preview di sebelah kanan.
   - Jika di komputer sendiri:
     a. Install Node.js dari https://nodejs.org
     b. Buka terminal di folder project ini.
     c. Ketik `npm install` lalu enter.
     d. Ketik `npm run dev` lalu enter.
     e. Buka browser di http://localhost:5173
   - CATATAN: Di mode localhost ini, Login menggunakan sistem "Mock" (tersimpan di browser sementara), belum konek ke database asli. Gunakan akun demo:
     > admin / admin
     > merchant_user / merchant_user

2. BACKEND PREVIEW (XAMPP)
   - Install XAMPP.
   - Jalankan Apache & MySQL.
   - Buka folder `htdocs` di dalam folder instalasi XAMPP.
   - Buat folder baru, misal `qioslink-api`.
   - Copy file dari `callback_php.txt` ke dalamnya, simpan jadi `callback.php`.
   - Buat database di http://localhost/phpmyadmin dengan nama `qios_db`.

--------------------------------------------------------------------------------
B. CARA UPLOAD KE HOSTING (Live Production)
--------------------------------------------------------------------------------

LANGKAH 1: SIAPKAN FRONTEND
1. Di komputer lokal (atau di terminal AI Studio jika bisa download), jalankan perintah:
   `npm run build`
2. Akan muncul folder baru bernama `dist`.
3. Isi folder `dist` inilah yang akan menjadi tampilan website Anda.
4. Compress/Zip isi folder `dist` tersebut.

LANGKAH 2: UPLOAD KE CPANEL
1. Login ke cPanel Hosting Anda.
2. Buka File Manager -> `public_html`.
3. Upload file zip dari Langkah 1, lalu Extract.
4. Sekarang jika Anda buka domain Anda, tampilan dashboard sudah muncul.

LANGKAH 3: SIAPKAN DATABASE
1. Di cPanel, cari menu "MySQL Databases".
2. Buat Database Baru (misal: `u12345_qios`).
3. Buat User Database Baru (misal: `u12345_admin`, password: `rahasia123`).
4. Klik "Add User to Database", centang "All Privileges".
5. Buka "phpMyAdmin" di cPanel.
6. Pilih database tadi, lalu klik tab "SQL".
7. Copy paste kode SQL yang ada di file `backend_php.txt` (bagian create table users & transactions). Klik Go.

LANGKAH 4: SIAPKAN BACKEND (API)
1. Buka file `callback_php.txt` di komputer Anda.
2. Edit bagian atas file ($host, $username, $password, $dbname) sesuai data di Langkah 3.
3. Simpan file tersebut dengan nama `callback.php`.
4. Upload `callback.php` ke `public_html` di cPanel (sejajar dengan file index.html dari React tadi).

LANGKAH 5: KONEKSIKAN KE QIOSPAY
1. Login ke dashboard Mitra Qiospay.
2. Masuk menu Integrasi.
3. Di kolom "URL Callback", masukkan alamat website Anda + nama file php tadi.
   Contoh: `https://domain-anda.com/callback.php`
4. Simpan.

SELESAI!
Sekarang setiap ada pembayaran sukses via QRIS Qiospay:
1. Qiospay akan memanggil `callback.php` di hosting Anda.
2. `callback.php` akan mengecek database dan mengubah status transaksi jadi 'PAID'.
3. User bisa melihat statusnya berubah di Dashboard.
