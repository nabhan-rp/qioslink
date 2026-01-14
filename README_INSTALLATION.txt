
================================================================================
QIOSLINK - PANDUAN INSTALASI LENGKAP (V4.6 - KYC SUPPORT)
================================================================================

Aplikasi ini terdiri dari dua bagian:
1. FRONTEND (Tampilan Web) - Dibuat dengan React.
2. BACKEND (Logika Server) - Dibuat dengan PHP (karena Anda menggunakan Shared Hosting).

--------------------------------------------------------------------------------
A. CARA TEST DI LOCALHOST (Preview Sebelum Upload)
--------------------------------------------------------------------------------
(Lihat panduan versi sebelumnya untuk bagian ini, tidak ada perubahan signifikan)

--------------------------------------------------------------------------------
B. CARA UPLOAD KE HOSTING (Live Production)
--------------------------------------------------------------------------------

LANGKAH 1: SIAPKAN FRONTEND
1. Di komputer lokal: `npm run build`
2. Compress isi folder `dist` menjadi zip.

LANGKAH 2: UPLOAD KE CPANEL
1. Upload dan extract zip di `public_html`.

LANGKAH 3: SIAPKAN DATABASE
1. Buat Database & User MySQL di cPanel.
2. Buka phpMyAdmin.
3. Import file `file_sql.txt` (Rename jadi `database.sql` dulu).
   CATATAN PENTING: Jika Anda upgrade dari versi lama, jalankan perintah SQL manual untuk update tabel (Lihat instruksi upgrade).

LANGKAH 4: SIAPKAN BACKEND (API)
1. Buat folder `api` di `public_html`.
2. Upload file-file PHP backend (db_connect.php, manage_users.php, dll).
3. Edit `db_connect.php` dengan kredensial database Anda.

LANGKAH 5: KONFIGURASI KYC (Identity Verification)
1. Login sebagai Superadmin (default: admin/admin).
2. Masuk ke Menu "Settings & Profile".
3. Klik tab "KYC Config".
4. Pilih Metode:
   - MANUAL: User akan diminta menghubungi Admin via WhatsApp untuk verifikasi KTP.
   - DIDIT.ME: Masukkan Client ID & Secret dari Dashboard Didit.me untuk verifikasi otomatis.

SELESAI!
