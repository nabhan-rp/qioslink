
# Changelog QiosLink

Semua perubahan penting pada proyek **QiosLink** (Dynamic QRIS Engine) didokumentasikan di file ini.

**Current Version:** `v4.6 (Public Beta)`
**Release Date:** 14 Januari 2026

---

## [v4.6] - 2026-01-14 (Current / Public Beta)
### Added
- **KYC Verification Support:** Pemisahan status verifikasi antara "Email Verified" dan "KYC Verified".
- **Didit.me Integration UI:** Penambahan form konfigurasi untuk API Didit.me pada panel Admin.
- **Verification Badges:** Indikator visual status KYC pada dashboard User dan Admin.
- **Manual KYC Approval:** Fitur bagi admin untuk menyetujui KYC pengguna secara manual.

### Fixed
- **Critical DB Connection:** Perbaikan cara penulisan password database yang mengandung karakter spesial pada `db_connect.php`.
- **Universal SMTP Path:** Perbaikan penggunaan `__DIR__` pada include path untuk mencegah error "No such file" pada server Linux/Shared Hosting.

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
