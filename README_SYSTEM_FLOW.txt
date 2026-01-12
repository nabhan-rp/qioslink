================================================================================
KNOWLEDGE BASE: ALUR SISTEM & LOGIKA FORWARDING
================================================================================

Dokumen ini menjawab pertanyaan: "Bagaimana WHMCS bisa tahu kalau user sudah bayar, padahal Callback Qiospay masuknya ke QiosLink?"

--------------------------------------------------------------------------------
1. KONSEP DASAR (ANALOGI)
--------------------------------------------------------------------------------
Bayangkan sistem ini seperti pengiriman paket:
- PENGIRIM (Pembeli) membayar uang.
- KURIR (Qiospay/Bank) memberi kabar uang sampai.
- KANTOR POS PUSAT (Server QiosLink/callback.php) menerima kabar dari Kurir.
- PENERIMA PAKET (WHMCS/WooCommerce) menunggu kabar dari Kantor Pos.

Masalahnya: Kurir (Qiospay) tidak tahu alamat Penerima Paket (WHMCS). Kurir hanya tahu alamat Kantor Pos Pusat.
Solusinya: Kantor Pos Pusat harus MENERUSKAN (Forward) kabar itu ke Penerima Paket.

--------------------------------------------------------------------------------
2. ALUR TEKNIS (LANGKAH DEMI LANGKAH)
--------------------------------------------------------------------------------

A. SAAT ORDER DIBUAT (Request)
   1. User checkout di WHMCS (Invoice #100, Rp 50.000).
   2. Modul WHMCS mengirim data ke API QiosLink (`create_payment.php`).
   3. Data yang dikirim: 
      - Merchant ID: 1
      - Amount: 50000
      - Callback URL WHMCS: `https://whmcs-anda.com/modules/gateways/callback/qioslink.php`
   4. QiosLink menyimpan data ini di database (`transactions` table).
      - Di tahap ini, QiosLink "mencatat" bahwa: "Jika nanti ada uang 50.000 masuk, saya harus lapor ke URL WHMCS di atas".

B. SAAT PEMBAYARAN SUKSES (The Callback Logic)
   1. User scan QRIS dan bayar.
   2. Qiospay mendeteksi uang masuk.
   3. Qiospay menembak `https://qioslink-anda.com/callback.php` (Callback Utama).
   
C. PROSES DI `callback.php` (Server QiosLink)
   1. Menerima notifikasi: "Hei, ada uang masuk Rp 50.000".
   2. Cek Database: "Siapa ya yang tadi request pembayaran 50.000 yang statusnya masih pending?".
   3. Ketemu! Transaksi Invoice #100 tadi.
   4. Update Status Database Lokal jadi 'PAID'.
   
   --- DISINI LOGIKA FORWARDING BEKERJA ---
   5. Cek kolom `external_callback_url` di database.
   6. Ternyata ada isinya: `https://whmcs-anda.com/.../qioslink.php`.
   7. `callback.php` melakukan cURL POST (Menembak balik) ke URL tersebut membawa data: "Invoice #100 LUNAS".
   
D. PROSES DI WHMCS
   1. File `modules/gateways/callback/qioslink.php` menerima tembakan dari langkah C.7.
   2. WHMCS mencatat invoice #100 sebagai Paid.
   3. Hosting aktif otomatis.

--------------------------------------------------------------------------------
3. IMPLEMENTASI KODE
--------------------------------------------------------------------------------

Untuk mewujudkan ini, pastikan Anda menggunakan kode terbaru dari `backend_php.txt`:

1. Di file `create_payment.php`:
   - Pastikan menangkap parameter `callback_url` dan menyimpannya ke database (kolom `external_callback_url`).

2. Di file `callback.php`:
   - Setelah status diupdate jadi PAID, tambahkan logika `curl_init($row['external_callback_url'])` untuk mengirim notifikasi ke website asal (WHMCS/Woo).

Kesimpulan: `callback.php` adalah OTAK dari sistem ini. Dia menerima dari Bank, lalu membagi-bagikan (Forward) infonya ke website yang berhak.
