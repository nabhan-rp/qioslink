================================================================================
PANDUAN INTEGRASI MODUL WHMCS
================================================================================

Prasyarat:
1. Server QiosLink (Web App ini) sudah online dan bisa diakses.
2. Anda sudah login ke QiosLink dan mendapatkan "Merchant ID" (lihat di menu Users/Dashboard).

--------------------------------------------------------------------------------
LANGKAH 1: PERSIAPAN FILE
--------------------------------------------------------------------------------
1. Buka file `module_whmcs.txt` yang disediakan oleh aplikasi ini.
2. Anda akan melihat dua bagian kode PHP.

--------------------------------------------------------------------------------
LANGKAH 2: UPLOAD KE WHMCS
--------------------------------------------------------------------------------
Masuk ke File Manager hosting tempat WHMCS Anda berada.

1. Buat File Gateway:
   - Masuk ke folder: `/modules/gateways/`
   - Buat file baru bernama: `qioslink.php`
   - Copy kode "FILE 1" dari `module_whmcs.txt` ke dalamnya.

2. Buat File Callback Gateway:
   - Masuk ke folder: `/modules/gateways/callback/`
   - Buat file baru bernama: `qioslink.php`
   - Copy kode "FILE 2" dari `module_whmcs.txt` ke dalamnya.

--------------------------------------------------------------------------------
LANGKAH 3: AKTIVASI DI WHMCS
--------------------------------------------------------------------------------
1. Login ke Admin Area WHMCS.
2. Pergi ke: System Settings -> Payment Gateways.
3. Klik tab "All Payment Gateways".
4. Cari "QiosLink QRIS (Nobu)" lalu klik.
5. Centang "Show on Order Form".
6. Isi Konfigurasi:
   - Display Name: QRIS (Nobu Bank)
   - API URL: `https://domain-qioslink-anda.com/create_payment.php` 
     (Ganti dengan domain tempat Anda menginstall aplikasi web QiosLink ini)
   - Merchant ID: Masukkan ID User Anda (misal: 1, atau 2). Cek di database tabel users kolom id.
7. Klik Save Changes.

--------------------------------------------------------------------------------
CARA TEST
--------------------------------------------------------------------------------
1. Buat order dummy di WHMCS.
2. Pilih metode pembayaran QRIS.
3. Anda akan melihat QR Code muncul.
4. Scan bayar (pakai nominal kecil untuk test, misal Rp 100 perak jika Qiospay support, atau Rp 10.000).
5. Tunggu notifikasi Qiospay masuk ke Server QiosLink.
6. Server QiosLink akan meneruskan ke WHMCS.
7. Refresh halaman invoice WHMCS, status harusnya berubah jadi PAID.
