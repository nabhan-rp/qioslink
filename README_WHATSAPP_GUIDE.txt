
================================================================================
PANDUAN INTEGRASI WHATSAPP GATEWAY (LOGIN & 2FA)
================================================================================

QiosLink menggunakan WhatsApp untuk 3 hal:
1. Login tanpa password (OTP).
2. Two-Factor Authentication (2FA).
3. Notifikasi (Opsional).

Provider yang didukung saat ini:
A. Fonnte (Unofficial, Paling Mudah)
B. Meta Cloud API (Official, Enterprise)

--------------------------------------------------------------------------------
CARA 1: MENGGUNAKAN FONNTE (Recommended)
--------------------------------------------------------------------------------
Fonnte adalah gateway unofficial yang memungkinkan Anda menggunakan nomor WA biasa (pribadi/bisnis) sebagai bot pengirim OTP.

Langkah-langkah:
1. Daftar di https://fonnte.com
2. Login dashboard Fonnte -> Device.
3. Scan QR Code menggunakan WhatsApp di HP Anda (Linked Device).
4. Copy "Token" yang muncul di dashboard.
5. Masuk ke Dashboard QiosLink -> Settings -> Auth & Security.
6. Pilih Provider: "Unofficial (Fonnte)".
7. Paste Token Fonnte.
8. Klik Save.

Test:
- Coba logout, lalu login kembali.
- Atau coba fitur "Verify WhatsApp" di tab Account.

--------------------------------------------------------------------------------
CARA 2: META CLOUD API (Official)
--------------------------------------------------------------------------------
Hanya untuk bisnis yang sudah terverifikasi Facebook Business Manager.

1. Buka developers.facebook.com.
2. Setup WhatsApp API.
3. Dapatkan:
   - Phone Number ID
   - App ID
   - Permanent Access Token
4. Masukkan data tersebut ke Dashboard QiosLink.

--------------------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------------------
Q: OTP tidak masuk?
A: 
1. Cek kuota Fonnte Anda.
2. Pastikan nomor tujuan menggunakan format internasional (628...), QiosLink sudah otomatis memformatnya, tapi pastikan user input benar.
3. Cek file `backend_wa_handlers.txt` pastikan `send_otp.php` sudah terupload di folder `/api/`.

Q: Saya Admin, apakah saya bisa terkunci?
A: 
Jika Anda mengaktifkan "Force 2FA" atau "All Users Login Scope" dan WA Gateway mati, Anda bisa terkunci.
Solusi Darurat:
1. Buka phpMyAdmin (Database).
2. Cari tabel `users`, row `admin`.
3. Set `two_factor_enabled` = 0.
4. Set `wa_login_enabled` = 0.
