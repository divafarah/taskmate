TaskMate
TaskMate adalah aplikasi web sederhana untuk mengelola daftar tugas kuliah.
Teknologi yang Digunakan
1. Git dan GitHub
Git digunakan untuk mengelola versi source code dan mencatat perubahan melalui commit. GitHub digunakan untuk menyimpan repository secara online, mengelola branch, merge, dan Pull Request.
2. npm
npm (Node Package Manager) digunakan untuk mengelola package dan dependency dalam project. Dependencies merupakan package yang dibutuhkan aplikasi, sedangkan devDependencies digunakan selama proses pengembangan.
3. TypeScript
TypeScript merupakan pengembangan JavaScript yang memiliki sistem tipe data. TaskMate menggunakan string, number, boolean, array, interface, type alias, union type, dan generic.
4. Vite
Vite merupakan build tool yang digunakan untuk menjalankan server pengembangan dan membangun aplikasi agar siap dipublikasikan.
5. Environment Variables
Environment variables digunakan untuk menyimpan konfigurasi aplikasi di luar source code. TaskMate menggunakan file `.env` untuk mengatur nama dan versi aplikasi. File `.env.example` disediakan sebagai contoh konfigurasi.
Compiler, Transpiler, dan Bundler
-Compiler: memproses kode sumber agar dapat digunakan oleh sistem atau lingkungan target.
-Transpiler: mengubah TypeScript menjadi JavaScript agar dapat dijalankan oleh browser.
-Bundler: menggabungkan dan mengoptimalkan file aplikasi beserta dependency menjadi hasil build.
Menjalankan Project
```bash
npm install
npm run dev
```
Untuk membuat hasil build:
```bash
npm run build
```