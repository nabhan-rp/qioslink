
================================================================================
PANDUAN INTEGRASI MODUL WHMCS (MANUAL UPLOAD)
================================================================================

PENTING: Modul ini TIDAK AKAN MUNCUL di fitur pencarian "Apps & Integrations" WHMCS.
Ini adalah modul custom (Self-Hosted), jadi Anda harus memasangnya secara MANUAL lewat cPanel.

--------------------------------------------------------------------------------
LANGKAH 1: PERSIAPAN FILE
--------------------------------------------------------------------------------
1. Buka file `module_whmcs.txt` yang disediakan oleh aplikasi ini.
2. Anda akan melihat dua bagian kode PHP. Pisahkan kode tersebut menjadi dua file berbeda di komputer Anda.

--------------------------------------------------------------------------------
LANGKAH 2: UPLOAD KE DIRECTORY WHMCS (WAJIB)
--------------------------------------------------------------------------------
Masuk ke File Manager hosting tempat WHMCS Anda berada (Bukan hosting QiosLink jika beda server).

1. FILE GATEWAY UTAMA
   - Lokasi Upload: `/modules/gateways/`
   - Nama File: `qioslink.php`
   - Isi File: Copy kode dari bagian "FILE 1" di `module_whmcs.txt`.

2. FILE CALLBACK
   - Lokasi Upload: `/modules/gateways/callback/`
   - Nama File: `qioslink.php` (Namanya sama, tapi foldernya beda)
   - Isi File: Copy kode dari bagian "FILE 2" di `module_whmcs.txt`.

--------------------------------------------------------------------------------
LANGKAH 3: AKTIVASI DI WHMCS ADMIN
--------------------------------------------------------------------------------
1. Login ke Admin Area WHMCS.
2. Pergi ke: System Settings (Icon Kunci Inggris/Obeng) -> Payment Gateways.
3. Klik tab "All Payment Gateways".
4. Cari "QiosLink QRIS (Nobu)" di daftar tersebut.
   (Jika langkah 2 benar, modul pasti muncul disini).
5. Klik nama modulnya untuk mengaktifkan.
6. Centang "Show on Order Form".
7. Isi Konfigurasi:
   - Display Name: QRIS (Nobu Bank)
   - API URL: `https://domain-qioslink-anda.com/api/create_payment.php` 
     (Ganti dengan domain tempat Anda menginstall aplikasi web QiosLink ini)
   - Merchant ID: Masukkan ID User Anda (Cek di menu Dashboard QiosLink).
   - API Key: Masukkan Secret Key Anda.
8. Klik Save Changes.

--------------------------------------------------------------------------------
CARA TEST
--------------------------------------------------------------------------------
1. Buat order dummy di WHMCS sebagai client.
2. Pilih metode pembayaran QRIS saat checkout.
3. Anda akan melihat QR Code muncul.
4. Scan bayar (pakai nominal kecil untuk test).
5. Refresh halaman invoice WHMCS, status harusnya berubah jadi PAID otomatis.
