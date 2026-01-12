================================================================================
PANDUAN UPDATE FITUR USER MANAGEMENT (GUI)
================================================================================

Sekarang aplikasi QiosLink sudah mendukung manajemen user (Tambah/Edit/Hapus) 
langsung dari halaman Superadmin, tanpa perlu membuka phpMyAdmin.

--------------------------------------------------------------------------------
CARA PASANG DI PRODUCTION (LIVE HOSTING)
--------------------------------------------------------------------------------
1. Download file `backend_manage_users.txt`.
2. Rename file tersebut menjadi `manage_users.php`.
3. Upload ke folder `/api/` di hosting Anda (bersamaan dengan `create_payment.php` dll).
4. Selesai.

--------------------------------------------------------------------------------
CARA KERJA
--------------------------------------------------------------------------------
- Frontend (React) akan mengirim request ke `manage_users.php`.
- Parameter `action` menentukan operasi: 'create', 'update', 'delete', atau 'list'.
- Password disimpan sesuai format database (saat ini plain text agar kompatibel dengan sistem demo).

--------------------------------------------------------------------------------
CATATAN KEAMANAN
--------------------------------------------------------------------------------
Saat ini sistem login masih sederhana. Untuk keamanan maksimal di masa depan:
1. Ubah `manage_users.php` agar menggunakan `password_hash($pass, PASSWORD_DEFAULT)`.
2. Ubah `login.php` agar menggunakan `password_verify()`.
