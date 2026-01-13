
# Changelog QiosLink

Semua perubahan penting pada proyek **QiosLink** (Dynamic QRIS Engine) didokumentasikan di file ini.

**Current Version:** `v4.8 (Enterprise Beta)`
**Release Date:** 14 Januari 2026

---

## [v4.8] - 2026-01-14 (Enterprise Update)
### Added
- **Social Login (OAuth):** Dukungan login menggunakan akun Google, Facebook, dan GitHub.
- **WhatsApp 2FA:** Fitur keamanan Two-Factor Authentication menggunakan OTP WhatsApp.
- **WhatsApp Login (Passwordless):** Opsi login menggunakan nomor HP dan OTP saja.
- **Database Schema Update:** Kolom baru untuk menyimpan provider ID dan status verifikasi telepon.

### Fixed
- **Login Logic:** Logika login PHP diperbarui untuk mengecek status 2FA sebelum memberikan akses penuh.
- **Backend Bundle:** Penambahan file `social_login.php`, `send_otp.php`, dan `verify_otp.php`.

---

## [v4.6] - 2026-01-12
### Added
- **KYC Verification:** Integrasi dengan Didit.me untuk verifikasi identitas otomatis.
- **Universal SMTP:** Engine pengirim email tanpa library eksternal (Socket Based).

---

## [v4.0] - 2026-01-10
### Added
- **Multi-Tenant System:** Arsitektur database mendukung banyak merchant.
- **RBAC:** Role Superadmin, Merchant, CS, User.
