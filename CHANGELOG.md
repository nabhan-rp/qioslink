
# Changelog QiosLink

Semua perubahan penting pada proyek **QiosLink** (Dynamic QRIS Engine) didokumentasikan di file ini.

**Current Version:** `v4.5 (Public Beta)`
**Release Date:** 13 Januari 2026

---

## [v4.5] - 2026-01-13 (Current / Public Beta)
### Fixed
- **Critical DB Connection:** Perbaikan cara penulisan password database yang mengandung karakter spesial pada `db_connect.php`.
- **Universal SMTP Path:** Perbaikan penggunaan `__DIR__` pada include path untuk mencegah error "No such file" pada server Linux/Shared Hosting.
- **Undefined Array Keys:** Penambahan validasi `isset()` pada konfigurasi SMTP untuk mencegah PHP Warning.

### Changed
- Status aplikasi ditingkatkan menjadi **Public Beta**.
- Update SEO Meta Tags pada `index.html` untuk mencerminkan kapabilitas SaaS.

---

## [v4.4] - 2026-01-12
### Added
- **Universal SMTP Engine:** Fitur pengirim email mandiri menggunakan `fsockopen` (Socket Based). Tidak lagi bergantung pada `mail()` bawaan PHP atau library PHPMailer eksternal yang berat. Bypass blokir port SMTP pada Free Hosting.
- **SaaS Landing Page:** Halaman depan baru dengan opsi "Cloud SaaS" atau "Self-Hosted".
- **Dynamic Footer:** Penambahan link ke Live Demo dan Cloud Service.
- **Demo Mode Label:** Indikator visual otomatis `(Demo)` pada dashboard jika berjalan tanpa backend PHP.

---

## [v4.0] - 2026-01-10
### Added
- **Multi-Tenant System:** Arsitektur database baru mendukung banyak merchant dalam satu instalasi.
- **RBAC (Role-Based Access Control):** Pemisahan hak akses login:
    - `Superadmin`: Akses penuh server.
    - `Merchant`: Mengelola QRIS sendiri.
    - `CS`: Pembantu merchant (read-only settings).
    - `User`: Pengguna publik (hanya history transaksi).
- **Public Registration:** Fitur `register.php` yang memungkinkan publik mendaftar akun sendiri.
- **Email Verification:** Sistem OTP 6 digit untuk memverifikasi email pengguna baru.

---

## [v3.0] - 2026-01-05
### Added
- **Integration Modules:** Peluncuran modul siap pakai untuk:
    - WHMCS (Payment Gateway Module)
    - WooCommerce (WordPress Plugin)
    - Shopify (Relay Bridge Script)
- **Production Backend:** Migrasi penuh dari Mock Data (LocalStorage) ke PHP Native + MySQL.
- **Webhook Forwarding:** Fitur `callback.php` yang mampu meneruskan sinyal pembayaran ke aplikasi pihak ketiga (WHMCS/Woo).

---

## [v2.0] - 2025-12-25
### Added
- **Dynamic QR Logic:** Implementasi algoritma CRC16 (CCITT-FALSE) untuk mengubah string statis Qiospay menjadi dinamis (Tag 54 injection).
- **Terminal UI:** Antarmuka visual untuk membuat link pembayaran manual dengan nominal kustom.
- **Expiring Links:** Logika kadaluarsa link pembayaran.

---

## [v1.0] - 2025-12-01 (Alpha)
### Initial Release
- Tampilan Dashboard React dasar.
- Integrasi QR Code Library.
- Statis QRIS Display.
- Mock Data structure.

---

> **Note:** Versi ini adalah **Public Beta**. Meskipun fitur inti sudah berjalan stabil, disarankan untuk melakukan pengujian transaksi nominal kecil sebelum digunakan untuk transaksi bervolume besar.
