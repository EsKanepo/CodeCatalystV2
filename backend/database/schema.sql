DROP DATABASE IF EXISTS codecatalyst_lms;
CREATE DATABASE codecatalyst_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codecatalyst_lms;

SELECT 'DATABASE CREATED - Starting table creation...' as status;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'premium', 'admin') DEFAULT 'student',
  enrolled_courses JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userPoint INT DEFAULT 500
);

SELECT '✅ Users table created' as status;

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  modules INT DEFAULT 0,
  lessons INT DEFAULT 0,
  projects INT DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  original_price DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  students INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT FALSE,
  topics JSON,
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT '✅ Courses table created' as status;

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'completed', 'suspended') DEFAULT 'active',
  UNIQUE KEY unique_enrollment (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

SELECT '✅ Enrollments table created' as status;

CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  completed_lessons INT DEFAULT 0,
  total_lessons INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  started_at TIMESTAMP NULL,
  last_accessed TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  completed_lessons_data JSON,
  time_spent INT DEFAULT 0,
  UNIQUE KEY unique_progress (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

SELECT '✅ Progress table created' as status;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

SELECT '✅ Testimonials table created' as status;

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT '✅ FAQ table created' as status;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  replied_at TIMESTAMP NULL
);

SELECT '✅ Contacts table created' as status;

CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  duration_minutes INT NOT NULL,
  max_participants INT NOT NULL,
  current_participants INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  meeting_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

SELECT '✅ Schedules table created' as status;
SELECT '🎯 ALL TABLES CREATED SUCCESSFULLY!' as milestone;

INSERT INTO courses (slug, title, description, category, instructor, duration, level, modules, lessons, projects, price, original_price, rating, students, is_locked, is_free, topics, thumbnail_url) VALUES
('html-fundamental', 'HTML Fundamental', 'Pelajari dasar-dasar HTML5 dari struktur dokumen hingga semantic elements', 'html', 'Nicholian Tjuarsa', '8 minggu', 'Beginner', 8, 48, 5, 299000, 399000, 4.8, 1250, FALSE, TRUE, JSON_ARRAY('HTML5', 'Semantic HTML', 'Forms', 'Tables'), '/images/courses/html.jpg'),
('css-styling', 'CSS Styling & Layout', 'Master CSS3 untuk styling modern dan responsive design', 'css', 'Nicholian Tjuarsa', '8 minggu', 'Beginner', 8, 48, 5, 299000, 399000, 4.7, 980, FALSE, TRUE, JSON_ARRAY('CSS3', 'Flexbox', 'Grid', 'Responsive'), '/images/courses/css.jpg'),
('javascript-dasar', 'JavaScript Dasar', 'Belajar JavaScript dari dasar hingga DOM manipulation dan ES6+', 'js', 'John Doe', '8 minggu', 'Intermediate', 7, 48, 8, 499000, 699000, 4.9, 750, TRUE, FALSE, JSON_ARRAY('ES6', 'DOM', 'Async', 'Events'), '/images/courses/javascript.jpg'),
('bootstrap-framework', 'Bootstrap Framework', 'Belajar Bootstrap untuk rapid development dan responsive design', 'bootstrap', 'Jane Smith', '3 minggu', 'Beginner', 3, 18, 4, 199000, 299000, 4.6, 590, TRUE, FALSE, JSON_ARRAY('Bootstrap5', 'Components', 'Grid', 'Utilities'), '/images/courses/bootstrap.jpg'),
('react-development', 'React Development', 'Membuat aplikasi web modern dengan React.js, hooks, dan state management', 'react', 'Mike Johnson', '8 minggu', 'Advanced', 5, 60, 12, 899000, 1200000, 4.8, 620, TRUE, FALSE, JSON_ARRAY('React', 'Hooks', 'Redux', 'Router'), '/images/courses/react.jpg'),
('nodejs-backend', 'Node.js Backend Development', 'Bangun RESTful API yang scalable dan efisien dengan Node.js dan Express', 'nodejs', 'Budi Santoso', '8 minggu', 'Intermediate', 8, 60, 10, 699000, 999000, 4.8, 850, TRUE, FALSE, JSON_ARRAY('Node.js', 'Express', 'API', 'MongoDB'), '/images/courses/nodejs.jpg'),
('vuejs-frontend', 'Vue.js Frontend Mastery', 'Pelajari framework progresif Vue.js untuk membangun antarmuka web interaktif', 'vuejs', 'Citra Dewi', '8 minggu', 'Intermediate', 8, 48, 6, 599000, 799000, 4.7, 640, TRUE, FALSE, JSON_ARRAY('Vue.js', 'Vuex', 'Vue Router', 'Composition API'), '/images/courses/vuejs.jpg'),
('typescript-essentials', 'TypeScript Essentials', 'Tingkatkan keandalan kode JavaScript Anda dengan static typing dari TypeScript', 'typescript', 'Ahmad Fauzi', '6 minggu', 'Intermediate', 6, 36, 5, 399000, 599000, 4.9, 920, TRUE, FALSE, JSON_ARRAY('Types', 'Interfaces', 'Generics', 'OOP'), '/images/courses/typescript.jpg'),
('git-github-mastery', 'Git & GitHub Mastery', 'Kuasai version control system dan kolaborasi tim menggunakan Git dan GitHub', 'git', 'Nicholian Tjuarsa', '3 minggu', 'Beginner', 3, 18, 3, 199000, 299000, 4.8, 1500, TRUE, FALSE, JSON_ARRAY('Git', 'GitHub', 'Branching', 'Merging'), '/images/courses/git.jpg'),
('docker-containerization', 'Docker Containerization', 'Pelajari cara memaketkan, mendistribusikan, dan menjalankan aplikasi menggunakan Docker', 'docker', 'Toni Gunawan', '4 minggu', 'Advanced', 4, 24, 8, 799000, 1099000, 4.7, 530, TRUE, FALSE, JSON_ARRAY('Docker', 'Containers', 'Images', 'Docker Compose'), '/images/courses/docker.jpg');


SELECT '✅ 6 courses inserted' as status;


INSERT INTO users (name, email, password_hash, role, enrolled_courses) VALUES
('Andi Pratama', 'andi.pratama@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('react-development')),

('Siti Nurhaliza', 'siti.nurhaliza@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling')),

('Budi Santoso', 'budi.santoso@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-fundamental')),

('Maya Putri', 'maya.putri@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling')),

('Rizky Ahmad', 'rizky.ahmad@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('bootstrap-framework')),

('Dewi Lestari', 'dewi.lestari@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('react-development')),

('Fajar Hidayat', 'fajar.hidayat@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('javascript-dasar')),

('Linda Wijaya', 'linda.wijaya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-css-combined')),

('Hendra Kusuma', 'hendra.kusuma@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('react-development')),

('Nina Amalia', 'nina.amalia@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling')),

('Eko Prasetyo', 'eko.prasetyo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('bootstrap-framework')),

('Ratna Sari', 'ratna.sari@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('javascript-dasar')),

('Ahmad Fauzi', 'ahmad.fauzi@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-fundamental')),

('Citra Dewi', 'citra.dewi@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'premium', JSON_ARRAY('react-development')),

('Bayu Setiawan', 'bayu.setiawan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling')),

('Fitri Handayani', 'fitri.handayani@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('bootstrap-framework')),

('Rizki Anwar', 'rizki.anwar@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('javascript-dasar')),

('Widi Astuti', 'widi.astuti@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-css-combined')),

('Toni Gunawan', 'toni.gunawan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('react-development')),

('Siska Permata', 'siska.permata@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling')),

('Doni Hermawan', 'doni.hermawan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('bootstrap-framework')),

('Yuni Kartika', 'yuni.kartika@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('javascript-dasar')),

('Agus Budi', 'agus.budi@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-fundamental')),

('Rini Susanti', 'rini.susanti@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('html-css-combined')),

('Joko Widodo', 'joko.widodo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', JSON_ARRAY('css-styling'));



SELECT '✅ 25 users inserted' as status;


INSERT INTO faqs (question, answer, category, order_index, is_active) VALUES
('Apa itu CodeCatalyst?', 'CodeCatalyst adalah platform edukasi online yang berfokus pada mata kuliah Pengembangan Pemrograman. Platform ini menyediakan kursus interaktif, pendaftaran online, jadwal belajar yang terstruktur, dan akses ke tutor berpengalaman untuk membantu mahasiswa menguasai pemrograman web modern.', 'General', 1, TRUE),

('Siapa saja yang bisa bergabung dengan CodeCatalyst?', 'CodeCatalyst terbuka untuk mahasiswa, profesional, dan siapa saja yang ingin belajar pemrograman web. Baik pemula yang baru mengenal coding maupun developer yang ingin meningkatkan skill bisa bergabung. Kami menyediakan jalur pembelajaran dari dasar hingga tingkat lanjut.', 'General', 2, TRUE),

('Apa saja kursus yang tersedia di CodeCatalyst?', 'Kami menyediakan kursus komprehensif meliputi: HTML Fundamental, CSS Styling, JavaScript Dasar, Bootstrap Framework, dan React Development. Setiap kursus dirancang dengan kurikulum terstruktur, project-based learning, dan didukung oleh materi pembelajaran yang up-to-date.', 'General', 3, TRUE),

('Berapa lama waktu yang dibutuhkan untuk menyelesaikan satu kursus?', 'Durasi setiap kursus bervariasi: HTML Fundamental (8 minggu), CSS Styling (8 minggu), JavaScript Dasar (8 minggu), Bootstrap Framework (3 minggu), dan React Development (5 section). Durasi dapat disesuaikan dengan kemampuan dan ketersediaan waktu belajar masing-masing peserta.', 'General', 4, TRUE),

('Apakah ada sertifikat setelah menyelesaikan kursus?', 'Ya, setiap peserta yang berhasil menyelesaikan kursus akan mendapatkan e-sertifikat yang dapat diunduh dan ditambahkan ke portofolio profesional. Sertifikat mencakup informasi kursus, durasi, kompetensi yang dicapai, dan validasi dari tutor pengajar.', 'General', 5, TRUE),

('Bagaimana cara mendaftar di CodeCatalyst?', 'Pendaftaran sangat mudah: 1) Klik tombol "Register" di homepage, 2) Isi formulir pendaftaran dengan data lengkap, 3) Verifikasi email Anda, 4) Login dan mulai belajar. Proses pendaftaran hanya membutuhkan waktu 5-10 menit dan Anda bisa langsung mengakses materi gratis.', 'Pendaftaran', 6, TRUE),

('Apakah pendaftaran gratis atau berbayar?', 'Kami menyediakan dua jenis akun: Free Account dengan akses ke materi dasar dan trial kursus, dan Premium Account dengan akses penuh ke semua kursus, sertifikat, dan support tutor. Anda bisa mulai dengan akun gratis dan upgrade kapan saja.', 'Pendaftaran', 7, TRUE),

('Data apa saja yang dibutuhkan untuk pendaftaran?', 'Untuk pendaftaran, Anda membutuhkan: Nama lengkap, Email aktif, Nomor telepon, Asal institusi (untuk mahasiswa), dan Password. Semua data akan disimpan secara aman dan sesuai dengan kebijakan privasi kami. Data hanya digunakan untuk keperluan pembelajaran dan komunikasi resmi.', 'Pendaftaran', 8, TRUE),

('Bisakah saya mendaftar tanpa email institusi?', 'Ya, Anda bisa mendaftar menggunakan email pribadi (Gmail, Yahoo, dll). Email institusi opsional dan hanya diperlukan jika Anda ingin mendapatkan benefit khusus untuk mahasiswa dari institusi yang bekerja sama dengan CodeCatalyst.', 'Pendaftaran', 9, TRUE),

('Bagaimana jika saya lupa password?', 'Jika lupa password, klik link "Lupa Password" di halaman login. Masukkan email Anda, kami akan mengirimkan link reset password. Link berlaku selama 24 jam. Pastikan email Anda valid dan periksa folder spam jika tidak menerima email dalam 5 menit.', 'Pendaftaran', 10, TRUE),

('Berapa biaya untuk setiap kursus?', 'Harga kursus bervariasi: Individual Course (Rp 299.000 - Rp 499.000), Bundle Package (Rp 899.000 untuk 3 kursus), dan All Access Pass (Rp 1.499.000 untuk semua kursus + 1 tahun support). Kami juga sering memberikan promo diskon hingga 50% di periode tertentu.', 'Pembayaran', 11, TRUE),

('Metode pembayaran apa saja yang diterima?', 'Kami menerima berbagai metode pembayaran: Transfer bank (BCA, Mandiri, BNI, BRI), E-wallet (GoPay, OVO, Dana, ShopeePay), Kartu kredit/debit, dan Virtual account. Semua transaksi aman dengan enkripsi SSL dan proses verifikasi otomatis.', 'Pembayaran', 12, TRUE),

('Apakah ada cicilan untuk pembayaran kursus?', 'Ya, kami menyediakan opsi cicilan dengan kerja sama kartu kredit (3, 6, dan 12 bulan) dan platform cicilan online (Shopee PayLater, Kredivo). Minimum pembelian untuk cicilan adalah Rp 300.000 dengan bunga 0% untuk tenor 3 dan 6 bulan.', 'Pembayaran', 13, TRUE),

('Bagaimana proses refund jika tidak puas dengan kursus?', 'Kami memberikan garansi uang kembali 100% dalam 7 hari pertama setelah pembelian. Jika tidak puas, kirimkan alasan pembatalan ke support@codecatalyst.id. Proses refund memakan waktu 3-5 hari kerja. Setelah 7 hari, refund tidak dapat dilakukan namun Anda bisa transfer kursus ke orang lain.', 'Pembayaran', 14, TRUE),

('Apakah ada potongan harga untuk mahasiswa?', 'Ya, mahasiswa aktif mendapatkan potongan 30% dengan menunjukkan kartu mahasiswa yang masih berlaku. Ada juga program "Study Together" diskon 20% untuk pendaftaran grup 3-5 orang. Diskon tidak dapat digabung dengan promo lainnya.', 'Pembayaran', 15, TRUE),

('Bagaimana format pembelajaran di CodeCatalyst?', 'Pembelajaran menggunakan blended learning: Video tutorial interaktif, Live session dengan tutor, Hands-on project, Quiz dan assignment, Peer review, dan Forum diskusi. Setiap minggu ada jadwal tetap untuk live class dan Q&A session.', 'Pembelajaran', 16, TRUE),

('Apakah ada jadwal tetap untuk pembelajaran?', 'Ya, kami memiliki jadwal terstruktur: Senin (HTML & CSS), Selasa (JavaScript), Rabu (Bootstrap), Kamis (React), dan Jumat (Project Workshop). Live class dilaksanakan pukul 19.00-21.00 WIB. Rekaman session tersedia 24/7 untuk yang tidak bisa join live.', 'Pembelajaran', 17, TRUE),

('Bagaimana cara menghubungi tutor untuk bertanya?', 'Anda bisa menghubungi tutor melalui: Forum diskusi di setiap materi, Live Q&A session, Direct message di platform, atau Email khusus per kursus. Tutor merespons dalam 24 jam pada hari kerja. Untuk pertanyaan urgent, ada emergency chat support.', 'Pembelajaran', 18, TRUE),

('Apakah materi pembelajaran bisa diunduh?', 'Video tutorial tidak bisa diunduh untuk melindungi hak cipta, namun Anda bisa akses streaming 24/7. Slide, code samples, dan dokumentasi bisa diunduh. Premium member mendapatkan akses ke offline mode di mobile app untuk belajar tanpa internet.', 'Pembelajaran', 19, TRUE),

('Bagaimana sistem penilaian dan progress tracking?', 'Kami menggunakan sistem penilaian komprehensif: Quiz (30%), Assignment (25%), Project (30%), dan Participation (15%). Progress tracking real-time menunjukkan completion rate, skill badges, dan learning analytics. Anda bisa export progress report untuk portofolio.', 'Pembelajaran', 20, TRUE),

('Apa saja requirements sistem untuk belajar?', 'Minimum requirements: OS Windows 10/macOS 10.14/Linux, RAM 4GB (8GB recommended), Processor i3 atau equivalent, Browser Chrome/Firefox/Safari latest version, Internet speed minimal 5 Mbps, dan Software VS Code atau text editor lainnya.', 'Teknis', 21, TRUE),

('Bagaimana jika mengalami masalah teknis saat belajar?', 'Untuk masalah teknis, hubungi melalui: Live chat support (24/7), Email tech@codecatalyst.id, atau Submit ticket di help center. Kami juga memiliki troubleshooting guide untuk common issues. Response time rata-rata 2 jam untuk urgent issues.', 'Teknis', 22, TRUE),

('Apakah CodeCatalyst bisa diakses dari mobile?', 'Ya, CodeCatalyst fully responsive dan bisa diakses dari browser mobile. Kami juga memiliki mobile app (Android/iOS) dengan fitur offline mode, push notifications, dan mobile-optimized interface. Download di Play Store atau App Store.', 'Teknis', 23, TRUE),

('Bagaimana dengan keamanan data pribadi saya?', 'Kami menggunakan enkripsi AES-256 untuk data storage, SSL/TLS untuk data transmission, regular security audits, dan compliance dengan GDPR dan PDPL. Data Anda tidak akan dibagikan ke pihak ketiga tanpa persetujuan eksplisit.', 'Teknis', 24, TRUE),

('Apakah ada API untuk developer?', 'Ya, kami menyediakan REST API untuk integration dengan sistem external. API documentation tersedia di developer.codecatalyst.id dengan rate limit 1000 requests/hour untuk free tier dan unlimited untuk enterprise plan.', 'Teknis', 25, TRUE),

('Apakah CodeCatalyst membantu penempatan kerja?', 'Ya, kami memiliki Career Center dengan job portal, resume review service, mock interview session, dan networking events. Partner kami meliputi 150+ perusahaan tech. Graduate placement rate mencapai 85% dalam 3 bulan setelah kelulusan.', 'Karir', 26, TRUE),

('Bagaimana reputasi sertifikat CodeCatalyst di industri?', 'Sertifikat CodeCatalyst diakui oleh 200+ perusahaan tech di Indonesia. Kami memiliki partnership dengan Google Developer Group, Microsoft Learn, dan GitHub Education. Alumni kami bekerja di startup unicorn, multinational companies, dan government digital services.', 'Karir', 27, TRUE),

('Apakah ada program internship atau magang?', 'Ya, kami memiliki Internship Program dengan partner companies. Top 10% graduates mendapatkan kesempatan internship 3-6 bulan dengan stipend. Requirements: minimum GPA 3.0, completion semua kursus, dan lulus technical assessment.', 'Karir', 28, TRUE),

('Bagaimana cara membangun portofolio selama belajar?', 'Setiap kursus memiliki capstone project yang bisa ditambahkan ke portofolio. Kami juga menyediakan GitHub integration, personal website builder, dan portfolio review sessions. Graduate showcase di website kami dengan 10,000+ monthly visitors.', 'Karir', 29, TRUE),

('Apakah ada alumni network atau komunitas?', 'Ya, kami memiliki alumni network 5000+ members dengan benefits: Exclusive job board, monthly meetup, mentorship program, dan alumni discount untuk advanced courses. Join alumni network setelah menyelesaikan minimum 2 kursus.', 'Karir', 30, TRUE);

SELECT '✅ 30 FAQs inserted' as status;


INSERT INTO testimonials (user_id, course_id, rating, testimonial, is_approved) VALUES
(1, 5, 5, 'CodeCatalyst benar-benar mengubah cara saya belajar programming! Mentor-mentor sangat profesional dan selalu available untuk membantu. Materi React yang diajarkan sangat up-to-date dengan industri saat ini. Setelah 3 bulan, saya berhasil dapat internship di startup unicorn! Highly recommended untuk siapa saja yang serius mau belajar web development.', TRUE),

(2, 2, 5, 'Sebagai ibu rumah tangga yang mau switch career, CodeCatalyst memberikan fleksibilitas yang saya butuhkan. Class sore sangat pas dengan jadwal saya. Mentor sangat sabar mengajari dari nol sampai saya bisa buat web app sendiri. Sekarang saya sudah freelance developer dengan income yang memuaskan!', TRUE),

(3, 1, 4, 'Materi HTML Fundamental sangat comprehensive dan well-structured. Yang saya suka adalah hands-on project setiap minggu, jadi langsung praktek. Mentor juga memberikan feedback yang detail. Hanya saja kadang live session agak crowded, tapi overall experience sangat baik!', TRUE),

(4, 2, 5, 'CSS course di CodeCatalyst beyond my expectations! Dari basic styling sampe advanced animation dan responsive design, semua diajarkan dengan cara yang mudah dimengerti. Project akhirnya saya buat portfolio website yang sekarang jadi portofolio utama saya. Thanks CodeCatalyst!', TRUE),

(5, 4, 4, 'Bootstrap course sangat praktis dan langsung applicable! Saya bisa belajar framework dengan cepat dan langsung implement di project kantor. Mentor sharing banyak tips dan tricks yang gak ada di documentation. Perfect untuk yang mau cepat productive!', TRUE),

(6, 5, 5, 'React course di CodeCatalyst top banget! Dari component lifecycle, hooks, sampe Redux, semua diajarkan dengan depth yang pas. Project finalnya bikin e-commerce app yang sekarang saya showcase di job interview. Alhamdulillah dapat kerja 2 bulan after graduation!', TRUE),

(7, 3, 5, 'Sebagai fresh graduate, CodeCatalyst bantu banget dalam persiapan kerja. Materi JavaScript dari basic ES6 sampe async/await sangat comprehensive. Mentor juga sharing tentang interview preparation dan code review. Sekarang saya kerja sebagai Junior Dev di fintech company!', TRUE),

(8, 6, 4, 'Sambil kuliah, saya ambil HTML & CSS course di CodeCatalyst. Flexibilitas waktu sangat membantu. Materinya relevan dengan mata kuliah di kampus. Mentor juga helpful saat saya stuck di assignment. Recommended untuk mahasiswa yang mau enrich skill!', TRUE),

(9, 5, 5, 'Switch career dari marketing ke IT adalah big decision, tapi CodeCatalyst bikin processnya smooth. React course sangat hands-on dengan real-world projects. Mentor support 24/7 di forum. After 4 months, saya berhasil dapat job sebagai React Developer dengan salary 2x dari previous job!', TRUE),

(10, 2, 5, 'CSS course di CodeCatalyst amazing! Saya belajar dari zero knowledge sampai bisa buat complex animations dan responsive layouts. Mentor sangat passionate dan selalu update dengan latest CSS features. Now I am working as CSS Specialist at creative agency!', TRUE);

SELECT '✅ 10 testimonials inserted' as status;


INSERT INTO schedules (course_id, title, description, instructor, start_time, duration_minutes, max_participants, current_participants, is_active, meeting_link) VALUES
(1, 'HTML Fundamental - Pagi Session', 'Kelas HTML Fundamental untuk pemula dengan fokus pada struktur website dan semantic elements', 'Nicholian Tjuarsa', '2024-05-06 09:00:00', 120, 30, 15, TRUE, 'https://zoom.us/j/html-morning'),

(2, 'CSS Styling & Layout - Pagi Session', 'Kelas CSS untuk styling modern dan responsive design', 'Nicholian Tjuarsa', '2024-05-06 09:00:00', 120, 30, 18, TRUE, 'https://zoom.us/j/css-morning'),

(3, 'JavaScript Dasar - Sore Session', 'Kelas JavaScript dasar untuk intermediate level dengan ES6+', 'Ethan Wilbert', '2024-05-07 19:00:00', 120, 25, 20, TRUE, 'https://zoom.us/j/js-evening'),

(4, 'Bootstrap Framework - Sore Session', 'Kelas Bootstrap untuk rapid development', 'Jane Smith', '2024-05-08 19:00:00', 90, 20, 12, TRUE, 'https://zoom.us/j/bootstrap-evening'),

(5, 'React Development - Pagi Session', 'Kelas React development dengan hooks dan state management', 'Mike Johnson', '2024-05-09 09:00:00', 120, 25, 22, TRUE, 'https://zoom.us/j/react-morning'),

(6, 'HTML & CSS Combined - Sore Session', 'Kelas kombinasi HTML dan CSS untuk web development fundamental', 'Ethan Wilbert', '2024-05-10 19:00:00', 120, 30, 25, TRUE, 'https://zoom.us/j/htmlcss-evening');

SELECT '✅ 6 schedules inserted' as status;


INSERT INTO contacts (name, email, subject, message, is_read, is_replied) VALUES
('Budi Santoso', 'budi.santoso@email.com', 'Pertanyaan Course React', 'Saya tertarik dengan course React development, apakah ada discount untuk pembelian bundle?', FALSE, FALSE),

('Siti Nurhaliza', 'siti.nurhaliza@email.com', 'Kendala Login', 'Saya tidak bisa login ke akun saya, padahal password sudah benar. Mohon bantuan.', FALSE, FALSE),

('Ahmad Fauzi', 'ahmad.fauzi@email.com', 'Request Course Baru', 'Apakah akan ada course tentang Python programming? Saya sangat tertarik untuk belajar Python.', FALSE, FALSE),

('Dewi Lestari', 'dewi.lestari@email.com', 'Sertifikat Tidak Muncul', 'Saya sudah menyelesaikan course HTML tapi sertifikat tidak muncul di dashboard saya.', FALSE, FALSE),

('Rudi Hermawan', 'rudi.hermawan@email.com', 'Feedback Course CSS', 'Course CSS sangat bagus! Tapi mungkin bisa ditambahkan section tentang CSS Grid yang lebih mendalam.', TRUE, FALSE);

SELECT '✅ 5 contact messages inserted' as status;

INSERT INTO enrollments (user_id, course_id, status) VALUES
(1, 5, 'completed'), 
(2, 2, 'completed'), 
(3, 1, 'completed'),
(4, 2, 'completed'),  
(5, 4, 'completed'), 
(6, 5, 'completed'),  
(7, 3, 'active'),     
(8, 6, 'active'),     
(9, 5, 'completed'), 
(10, 2, 'completed'), 
(11, 4, 'completed'), 
(12, 3, 'completed'), 
(13, 1, 'completed'), 
(14, 5, 'completed'), 
(15, 2, 'completed'), 
(16, 4, 'completed'), 
(17, 3, 'completed'), 
(18, 6, 'active'),    
(19, 5, 'completed'), 
(20, 2, 'completed'), 
(21, 4, 'completed'), 
(22, 3, 'completed'), 
(23, 1, 'completed'), 
(24, 6, 'active'),   
(25, 2, 'completed');

SELECT '✅ 25 enrollments inserted' as status;


SELECT '🔍 FINAL VERIFICATION' as info;

SELECT 
    'Tables' as type,
    TABLE_NAME as table_name,
    TABLE_ROWS as row_count
FROM information_schema.tables 
WHERE table_schema = 'codecatalyst_lms'
ORDER BY TABLE_NAME;

SELECT 'Data Summary' as info;
SELECT 
    'Courses' as table_name, COUNT(*) as count FROM courses
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs
UNION ALL
SELECT 'Schedules', COUNT(*) FROM schedules
UNION ALL
SELECT 'Contacts', COUNT(*) FROM contacts;

SELECT 'Sample Data Preview' as info;
SELECT 'Top 5 Users:' as preview;
SELECT id, name, email, role FROM users LIMIT 5;

SELECT 'Top 5 Courses:' as preview;
SELECT id, slug, title, category, price, is_free FROM courses LIMIT 5;

SELECT 'Top 5 FAQs:' as preview;
SELECT id, LEFT(question, 50) as question_preview, category FROM faqs LIMIT 5;

SELECT 'Top 5 Testimonials:' as preview;
SELECT t.id, u.name, c.title, t.rating FROM testimonials t
JOIN users u ON t.user_id = u.id
JOIN courses c ON t.course_id = c.id LIMIT 5;

SELECT '🎉 BACKEND COMPATIBLE SETUP COMPLETE!' as final_status;
SELECT 'Database codecatalyst_lms is ready for backend use' as message;
SELECT 'Total records inserted:' as summary;
SELECT 
    (SELECT COUNT(*) FROM courses) as courses,
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM enrollments) as enrollments,
    (SELECT COUNT(*) FROM testimonials) as testimonials,
    (SELECT COUNT(*) FROM faqs) as faqs,
    (SELECT COUNT(*) FROM schedules) as schedules,
    (SELECT COUNT(*) FROM contacts) as contacts;

SELECT 'Login credentials for testing:' as credentials;
SELECT 'Admin: admin@codecatalyst.com | password: password' as admin_login;
SELECT 'Student: andi.pratama@example.com | password: password' as student_login;
SELECT 'Premium: citra.dewi@example.com | password: password' as premium_login;

SELECT 'Next steps:' as next_steps;
SELECT '1. Backend .env already configured' as step1;
SELECT '2. Start backend server - should show "Using MySQL database"' as step2;
SELECT '3. Test registration/login - data will save to MySQL' as step3;
SELECT '4. Update frontend to fetch data from MySQL APIs' as step4;

SELECT '🚀 Backend Compatible MySQL Setup - 100% Complete!' as completion;


INSERT INTO schedules (course_id, title, description, instructor, start_time, duration_minutes, max_participants, current_participants, is_active, meeting_link) VALUES
(7, 'Vue.js Frontend - Weekend Siang', 'Kelas framework Vue.js interaktif', 'Nicholian Tjuarsa', '2024-05-11 13:00:00', 120, 30, 0, TRUE, 'https://zoom.us/j/vuejs-afternoon'),
(8, 'TypeScript Essentials - Weekend Malam', 'Kelas static typing JavaScript', 'Nicholian Tjuarsa', '2024-05-11 19:00:00', 120, 30, 0, TRUE, 'https://zoom.us/j/typescript-evening'),
(9, 'Git & GitHub Mastery - Weekend Pagi', 'Kuasai version control dan kolaborasi', 'Anggara Adelee', '2024-05-12 09:00:00', 120, 30, 0, TRUE, 'https://zoom.us/j/git-morning'),
(10, 'Docker Containerization - Weekend Siang', 'Kelas implementasi Docker untuk pemula', 'Devin Owen Sanusi', '2024-05-12 13:00:00', 120, 30, 0, TRUE, 'https://zoom.us/j/docker-afternoon');