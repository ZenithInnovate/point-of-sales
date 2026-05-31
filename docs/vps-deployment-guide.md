# Panduan Deploy SaaS Multi-Tenant di Server VPS (Production)

Dokumen ini menyediakan panduan langkah demi langkah (Step-by-Step) untuk men-deploy aplikasi SaaS Multi-Tenant AkarPOS di server **VPS (Ubuntu 22.04 LTS + Nginx + PHP 8.2 + MySQL)** secara aman, efisien, dan production-ready.

---

## 📋 Prasyarat Sistem VPS

Sebelum memulai, pastikan server VPS Anda sudah terpasang:
* **PHP 8.2** atau versi terbaru dengan ekstensi wajib berikut:
  `php-cli, php-fpm, php-mysql, php-xml, php-mbstring, php-curl, php-gd, php-zip, php-bcmath`
* **Nginx** (sebagai Reverse Proxy Web Server)
* **MySQL 8.0** atau **MariaDB**
* **Composer** (Dependency Manager PHP)
* **NodeJS (NPM)** (Asset Bundler)

---

## 🔐 Langkah 1: Pengaturan Hak Akses Database (SANGAT KRUSIAL!)

> [!WARNING]
> **Poin Kunci Keamanan DB:**
> Karena perintah `tenant:create` akan membuat database baru secara otomatis di server MySQL, user database yang dikonfigurasi di file `.env` **wajib memiliki hak akses (privilege) `CREATE ON *.*`** atau hak akses `ALL PRIVILEGES` agar tidak terjadi error `Access denied` saat pembuatan database tenant.

1. Masuk ke console MySQL root di VPS Anda:
   ```bash
   sudo mysql -u root -p
   ```

2. Buat database pusat (landlord):
   ```sql
   CREATE DATABASE toko CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Buat user database khusus SaaS (misal: `saas_user`) dengan hak akses penuh untuk membuat database baru:
   ```sql
   CREATE USER 'saas_user'@'localhost' IDENTIFIED BY 'PasswordKuatAnda123!';
   GRANT ALL PRIVILEGES ON *.* TO 'saas_user'@'localhost' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## 📂 Langkah 2: Deploy Source Code & Konfigurasi `.env`

1. Clone repository project Anda ke direktori `/var/www/toko` di VPS:
   ```bash
   cd /var/www
   git clone <URL_REPO_ANDA> toko
   cd toko
   ```

2. Salin file `.env.example` ke `.env` dan konfigurasikan:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Sesuaikan parameter database pusat dengan user database yang telah kita buat sebelumnya:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://domain-pusat-anda.com # Domain utama landing page SaaS Anda

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=toko                      # Database pusat (landlord)
   DB_USERNAME=saas_user
   DB_PASSWORD=PasswordKuatAnda123!
   ```

3. Pasang dependensi PHP & buat Application Key:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   ```

4. Pasang dependensi NodeJS & Compile Asset frontend (React + Tailwind CSS):
   ```bash
   npm install
   npm run build
   ```

5. Hubungkan direktori publik ke direktori penyimpanan media (Storage Link):
   ```bash
   php artisan storage:link
   ```

---

## ⚙️ Langkah 3: Menjalankan Migrasi Landlord (Pusat)

Jalankan perintah ini untuk membuat tabel pendaftaran tenant (`tenants`) di database pusat:
```bash
php artisan migrate --path=database/migrations/landlord --database=landlord --force
```

---

## 🏪 Langkah 4: Mendaftarkan & Menyiapkan Tenant

Jalankan perintah `tenant:create` untuk masing-masing domain aktif Anda untuk membuat database secara otomatis, memigrasikan tabel POS, dan men-seed data default:

```bash
# 1. Daftarkan Tenant 1 menggunakan DB 'toko'
php artisan tenant:create tenant1 domain1.com "Toko Utama" --db-database=toko

# 2. Daftarkan Tenant 2 menggunakan DB 'toko2'
php artisan tenant:create tenant2 domain2.com "Toko Cabang" --db-database=toko2
```

---

## 🌐 Langkah 5: Konfigurasi Nginx Multi-Domain (Catch-All)

> [!TIP]
> **Metode Best Practice SaaS:**
> Kita tidak perlu membuat file konfigurasi Nginx terpisah untuk setiap domain tenant. Kita cukup membuat **satu file konfigurasi Nginx tunggal (Catch-All)** yang mendengarkan ke semua domain aktif Anda sekaligus!

1. Buat file konfigurasi Nginx baru:
   ```bash
   sudo nano /etc/nginx/sites-available/toko
   ```

2. Tempelkan konfigurasi berikut (daftarkan domain-domain aktif Anda di bagian `server_name`):
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       
       # Cantumkan seluruh domain aktif Anda dipisahkan dengan spasi
       server_name domain1.com domain2.com domain-pusat-anda.com;

       root /var/www/toko/public;
       index index.php index.html;

       charset utf-8;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location = /favicon.ico { access_log off; log_not_found off; }
       location = /robots.txt  { access_log off; log_not_found off; }

       access_log off;
       error_log  /var/log/nginx/toko-error.log error;

       error_page 404 /index.php;

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Sesuaikan versi PHP Anda
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }

       location ~ /\.ht {
           deny all;
       }
   }
   ```

3. Aktifkan konfigurasi Nginx dan muat ulang layanan:
   ```bash
   sudo ln -s /etc/nginx/sites-available/toko /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🔒 Langkah 6: Mengamankan Koneksi dengan SSL Gratis (HTTPS)

Gunakan Certbot untuk menginstal SSL Let's Encrypt gratis secara otomatis di seluruh domain aktif Anda:

1. Jalankan perintah Certbot:
   ```bash
   sudo certbot --nginx -d domain1.com -d domain2.com -d domain-pusat-anda.com
   ```
2. Pilih opsi **Redirect** agar semua trafik HTTP biasa (port 80) secara otomatis dialihkan ke HTTPS (port 443) yang aman.

---

## 🛡️ Langkah 7: Pengaturan Kepemilikan & Hak Akses Direktori (PENTING!)

Agar server Nginx (`www-data`) memiliki izin penuh untuk membuat folder isolasi tenant dan mengunggah berkas (seperti foto produk atau avatar kasir), jalankan perintah ini:
```bash
sudo chown -R www-data:www-data /var/www/toko
sudo chmod -R 775 /var/www/toko/storage
sudo chmod -R 775 /var/www/toko/bootstrap/cache
```
