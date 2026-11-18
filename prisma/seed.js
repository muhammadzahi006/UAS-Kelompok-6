const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database Eduvibe - Platform Matematika SMA...");

  // 1. Bersihkan data lama
  await prisma.notificationQueue.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Data lama berhasil dibersihkan");

  // 2. Hash passwords
  const hashAdmin = await bcrypt.hash("admin123", 10);
  const hashPengajar = await bcrypt.hash("pengajar123", 10);
  const hashMurid = await bcrypt.hash("murid123", 10);

  // 3. Pengguna (1 Admin, 2 Pengajar Matematika, 5 Murid SMA)
  const admin = await prisma.user.create({
    data: {
      name: "Super Administrator",
      email: "admin@eduvibe.id",
      password: hashAdmin,
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adminEduvibe&backgroundColor=b6e3f4",
      headline: "Platform Administrator & Operations Lead",
      bio: "Mengelola seluruh operasional ekosistem pembelajaran matematika di Eduvibe.",
    },
  });

  const pengajar1 = await prisma.user.create({
    data: {
      name: "Drs. Bambang Sudiro, M.Pd",
      email: "pengajar@eduvibe.id",
      password: hashPengajar,
      role: "PENGAJAR",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guruBambang&backgroundColor=d1d4f9",
      headline: "Guru Senior Matematika SMA & Pembina Olimpiade Sains",
      bio: "Berpengalaman lebih dari 15 tahun mengajar matematika SMA. Berfokus pada pemahaman logika, aljabar, kalkulus, dan strategi pemecahan soal analitis.",
    },
  });

  const pengajar2 = await prisma.user.create({
    data: {
      name: "Nurul Aini, S.Si, M.Mat",
      email: "pengajar2@eduvibe.id",
      password: hashPengajar,
      role: "PENGAJAR",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guruNurul&backgroundColor=ffd5dc",
      headline: "Master Matematika Terapan & Pengajar Geometri SMA",
      bio: "Spesialis dalam visualisasi geometri, trigonometri, dan statistika. Menerapkan pendekatan pembelajaran matematika kontekstual yang mudah dipahami siswa.",
    },
  });

  const murid1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "murid@eduvibe.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budiSiswa",
      headline: "Siswa Kelas 12 SMA Negeri 1",
      bio: "Mempersiapkan diri menghadapi SNBT dan ujian matematika perguruan tinggi.",
    },
  });

  const murid2 = await prisma.user.create({
    data: {
      name: "Dewi Anggraini",
      email: "murid2@eduvibe.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewiSiswa",
      headline: "Siswi Kelas 11 SMA Jurusan MIPA",
      bio: "Sangat menyukai topik geometri dan trigonometri.",
    },
  });

  const murid3 = await prisma.user.create({
    data: {
      name: "Reza Fahlevi",
      email: "murid3@eduvibe.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rezaSiswa",
      headline: "Siswa Kelas 10 SMA",
      bio: "Ingin memperkuat fondasi aljabar dan fungsi kuadrat.",
    },
  });

  const murid4 = await prisma.user.create({
    data: {
      name: "Anisa Rahma",
      email: "murid4@eduvibe.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anisaSiswa",
      headline: "Siswi Kelas 12 SMA",
      bio: "Target masuk jurusan Matematika & Sains Data.",
    },
  });

  const murid5 = await prisma.user.create({
    data: {
      name: "Fajar Nugroho",
      email: "murid5@eduvibe.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fajarSiswa",
      headline: "Siswa Kelas 11 SMA",
      bio: "Tertarik pada logika matriks dan penerapan statistika peluang.",
    },
  });

  console.log("✅ Akun pengguna Eduvibe berhasil dibuat");

  // 4. Kategori Topik Matematika SMA
  const catAljabar = await prisma.category.create({
    data: {
      name: "Aljabar & Fungsi",
      slug: "aljabar",
      description: "Persamaan dan pertidaksamaan kuadrat, fungsi komposisi, eksponen, logaritma, dan polinomial.",
      icon: "Binary",
    },
  });

  const catGeometri = await prisma.category.create({
    data: {
      name: "Geometri & Trigonometri",
      slug: "trigonometri",
      description: "Sudut istimewa, aturan sinus dan cosinus, identitas trigonometri, dan dimensi tiga.",
      icon: "Triangle",
    },
  });

  const catKalkulus = await prisma.category.create({
    data: {
      name: "Kalkulus Dasar",
      slug: "kalkulus",
      description: "Limit fungsi aljabar, konsep turunan diferensial, dan integral tentu maupun tak tentu.",
      icon: "Activity",
    },
  });

  const catStatistika = await prisma.category.create({
    data: {
      name: "Statistika & Peluang",
      slug: "statistika",
      description: "Ukuran pemusatan dan penyebaran data, kaidah pencacahan, permutasi, kombinasi, dan peluang kejadian.",
      icon: "BarChart3",
    },
  });

  const catMatriks = await prisma.category.create({
    data: {
      name: "Matriks & Transformasi",
      slug: "matriks",
      description: "Operasi matriks, determinan, invers ordo 2x2 dan 3x3, serta transformasi geometri bidang datar.",
      icon: "Grid",
    },
  });

  console.log("✅ 5 Kategori Matematika berhasil dibuat");

  // ==========================================
  // KURSUS 1: Aljabar & Fungsi SMA (Kelas 10)
  // ==========================================
  const course1 = await prisma.course.create({
    data: {
      title: "Aljabar & Fungsi SMA: Persamaan Kuadrat hingga Polinomial",
      slug: "aljabar-fungsi-sma",
      subtitle: "Kuasai konsep aljabar esensial SMA: persamaan kuadrat, eksponen, logaritma, fungsi komposisi, dan suku banyak polinomial.",
      description: `Aljabar merupakan fondasi dari seluruh matematika SMA. Kursus ini membedah konsep persamaan kuadrat, sifat-sifat eksponen dan bentuk akar, hukum logaritma, operasi fungsi komposisi dan invers, serta teorema sisa polinomial. Disertai dengan contoh penurunan rumus dan pembuktian langkah demi langkah secara tertulis.`,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "BEGINNER",
      isPublished: true,
      requirements: "Operasi aritmatika dasar (penjumlahan, pengurangan, perkalian, pembagian variabel).",
      objectives: "Mencari akar persamaan kuadrat dengan rumus abc; Menguasai sifat logaritma; Menyelesaikan fungsi komposisi; Menghitung sisa pembagian polinomial.",
      instructorId: pengajar1.id,
      categoryId: catAljabar.id,
      sections: {
        create: [
          {
            title: "Modul 1: Persamaan & Fungsi Kuadrat",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Konsep Dasar Bentuk Umum Persamaan Kuadrat",
                  duration: 480,
                  order: 1,
                  isPreview: true,
                  description: `Bentuk umum persamaan kuadrat adalah ax² + bx + c = 0, dengan syarat a ≠ 0 dan a, b, c ∈ R.

Akar-akar persamaan kuadrat adalah nilai x yang memenuhi persamaan tersebut. Metode penyelesaian utama:
1. Pemfaktoran: Mencari dua bilangan p dan q sedemikian sehingga p + q = b dan p × q = a × c.
2. Melengkapkan Kuadrat Sempurna: Mengubah bentuk x² + (b/a)x menjadi kuadrat sempurna.
3. Rumus Kuadrat (Rumus ABC):
   x₁,₂ = (-b ± √(b² - 4ac)) / (2a)

Diskriminan (D = b² - 4ac) menentukan jenis akar:
- D > 0: Dua akar real berlainan.
- D = 0: Dua akar real kembar (sama).
- D < 0: Tidak memiliki akar real (akar imajiner/kompleks).

Hubungan Akar-Akar (Teorema Vieta):
- x₁ + x₂ = -b / a
- x₁ × x₂ = c / a
- |x₁ - x₂| = √D / |a|`,
                },
                {
                  title: "2. Nilai Ekstrem & Titik Puncak Fungsi Kuadrat",
                  duration: 540,
                  order: 2,
                  isPreview: false,
                  description: `Fungsi kuadrat memiliki bentuk f(x) = ax² + bx + c. Grafiknya berupa kurva parabola.

Arah kurva ditentukan oleh tanda koefisien a:
- a > 0: Parabola terbuka ke atas, memiliki titik balik minimum.
- a < 0: Parabola terbuka ke bawah, memiliki titik balik maksimum.

Titik Puncak / Titik Balik (Xp, Yp):
- Xp (Sumbu Simetri) = -b / (2a)
- Yp (Nilai Optimum/Ekstrem) = -D / (4a), di mana D = b² - 4ac.

Kedudukan Parabola terhadap Sumbu X:
- D > 0: Memotong sumbu X di 2 titik berbeda.
- D = 0: Menyinggung sumbu X di 1 titik.
- D < 0: Tidak memotong maupun menyinggung sumbu X (Definit positif jika a > 0, Definit negatif jika a < 0).`,
                },
              ],
            },
          },
          {
            title: "Modul 2: Eksponen, Bentuk Akar & Logaritma",
            order: 2,
            lessons: {
              create: [
                {
                  title: "3. Sifat Operasi Eksponen & Bentuk Akar",
                  duration: 600,
                  order: 1,
                  isPreview: false,
                  description: `Sifat-Sifat Utama Perpangkatan (Eksponen):
1. aᵐ × aⁿ = aᵐ⁺ⁿ
2. aᵐ / aⁿ = aᵐ⁻ⁿ
3. (aᵐ)ⁿ = aᵐⁿ
4. (a × b)ⁿ = aⁿ × bⁿ
5. (a / b)ⁿ = aⁿ / bⁿ
6. a⁰ = 1 (untuk a ≠ 0)
7. a⁻ⁿ = 1 / aⁿ
8. a^(m/n) = ⁿ√(aᵐ)

Merasionalkan Bentuk Akar:
- a / √b = (a / √b) × (√b / √b) = (a√b) / b
- c / (√a + √b) = c(√a - √b) / (a - b)

Bentuk Akar Khusus:
√((a + b) ± 2√(ab)) = √a ± √b, dengan syarat a > b > 0.`,
                },
                {
                  title: "4. Sifat Logaritma & Persamaan Logaritma",
                  duration: 620,
                  order: 2,
                  isPreview: false,
                  description: `Definisi: ᵃlog b = c ⇔ aᶜ = b, dengan basis a > 0, a ≠ 1, dan numerus b > 0.

Sifat-Sifat Operasi Logaritma:
1. ᵃlog 1 = 0 dan ᵃlog a = 1
2. ᵃlog (b × c) = ᵃlog b + ᵃlog c
3. ᵃlog (b / c) = ᵃlog b - ᵃlog c
4. ᵃlog bⁿ = n × ᵃlog b
5. ᵃᵐlog bⁿ = (n / m) × ᵃlog b
6. ᵃlog b = (ᶜlog b) / (ᶜlog a) = 1 / (ᵇlog a)
7. ᵃlog b × ᵇlog c × ᶜlog d = ᵃlog d
8. a^(ᵃlog b) = b

Penyelesaian Persamaan Logaritma:
Jika ᵃlog f(x) = ᵃlog g(x), maka f(x) = g(x) dengan syarat numerus f(x) > 0 dan g(x) > 0.`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ==========================================
  // KURSUS 2: Geometri & Trigonometri SMA
  // ==========================================
  const course2 = await prisma.course.create({
    data: {
      title: "Geometri & Trigonometri SMA: Dari Sudut hingga Dimensi Tiga",
      slug: "geometri-trigonometri-sma",
      subtitle: "Kuasai perbandingan trigonometri sudut istimewa, aturan sinus-cosinus, luas segitiga, dan jarak titik ke bidang dimensi tiga.",
      description: `Materi geometri dan trigonometri adalah pilar penting dalam ujian sekolah dan tes masuk perguruan tinggi. Kursus tertulis ini merangkum definisi sudut di 4 kuadran, identitas trigonometri dasar, persamaan trigonometri, aturan sinus dan cosinus, hingga visualisasi jarak titik-garis-bidang pada bangun ruang kubus dan limas.`,
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "Teorema Pythagoras dan dasar bangun datar segitiga.",
      objectives: "Menghitung nilai sudut berelasi di semua kuadran; Membuktikan identitas trigonometri; Menggunakan aturan cosinus; Menghitung jarak titik ke garis pada kubus.",
      instructorId: pengajar2.id,
      categoryId: catGeometri.id,
      sections: {
        create: [
          {
            title: "Modul 1: Trigonometri Dasar & Sudut Berelasi",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Perbandingan Trigonometri pada Segitiga Siku-Siku",
                  duration: 500,
                  order: 1,
                  isPreview: true,
                  description: `Pada segitiga siku-siku dengan sudut θ:
- sin θ = sisi depan / sisi miring (demi)
- cos θ = sisi samping / sisi miring (sami)
- tan θ = sisi depan / sisi samping (desa)
- csc θ = 1 / sin θ
- sec θ = 1 / cos θ
- cot θ = 1 / tan θ

Nilai Sudut Istimewa Kuadran I:
- sin 0° = 0, sin 30° = 1/2, sin 45° = 1/2√2, sin 60° = 1/2√3, sin 90° = 1
- cos 0° = 1, cos 30° = 1/2√3, cos 45° = 1/2√2, cos 60° = 1/2, cos 90° = 0
- tan 0° = 0, tan 30° = 1/3√3, tan 45° = 1, tan 60° = √3, tan 90° = tak terdefinisi

Identitas Dasar:
- sin² θ + cos² θ = 1
- 1 + tan² θ = sec² θ
- 1 + cot² θ = csc² θ`,
                },
                {
                  title: "2. Sudut Berelasi di 4 Kuadran",
                  duration: 520,
                  order: 2,
                  isPreview: false,
                  description: `Tanda Fungsi Trigonometri di Setiap Kuadran (Aturan ASTC - All Sin Tan Cos):
- Kuadran I (0° - 90°): Semua bernilai Positif
- Kuadran II (90° - 180°): Hanya Sinus (dan Csc) Positif
- Kuadran III (180° - 270°): Hanya Tangen (dan Cot) Positif
- Kuadran IV (270° - 360°): Hanya Cosinus (dan Sec) Positif

Relasi Sudut Menggunakan (180° ± θ) dan (360° - θ):
Fungsi tetap (sin tetap sin, cos tetap cos), tanda menyesuaikan kuadran.
- sin(180° - θ) = sin θ
- cos(180° - θ) = -cos θ
- tan(180° + θ) = tan θ
- cos(360° - θ) = cos θ

Relasi Sudut Menggunakan (90° ± θ) dan (270° ± θ):
Fungsi berganti: sin ↔ cos, tan ↔ cot, sec ↔ csc.
- sin(90° + θ) = cos θ
- cos(90° + θ) = -sin θ`,
                },
              ],
            },
          },
          {
            title: "Modul 2: Aturan Segitiga & Geometri Dimensi Tiga",
            order: 2,
            lessons: {
              create: [
                {
                  title: "3. Aturan Sinus, Aturan Cosinus & Luas Segitiga",
                  duration: 580,
                  order: 1,
                  isPreview: false,
                  description: `Pada sembarang segitiga ABC dengan sisi a di depan sudut A, b di depan B, dan c di depan C:

Aturan Sinus:
a / sin A = b / sin B = c / sin C = 2R (di mana R adalah jari-jari lingkaran luar segitiga).
Digunakan saat diketahui: 2 sudut dan 1 sisi, atau 2 sisi dan 1 sudut di depan salah satu sisi.

Aturan Cosinus:
a² = b² + c² - 2bc cos A
b² = a² + c² - 2ac cos B
c² = a² + b² - 2ab cos C
cos A = (b² + c² - a²) / (2bc)
Digunakan saat diketahui: 3 sisi, atau 2 sisi dan 1 sudut apit.

Luas Segitiga Sembarang:
- L = 1/2 × a × b × sin C = 1/2 × b × c × sin A = 1/2 × a × c × sin B
- Rumus Heron (diketahui 3 sisi): L = √(s(s - a)(s - b)(s - c)), dengan s = 1/2(a + b + c).`,
                },
                {
                  title: "4. Jarak Titik, Garis & Bidang pada Bangun Ruang",
                  duration: 650,
                  order: 2,
                  isPreview: false,
                  description: `Konsep Jarak pada Dimensi Tiga (Kubus ABCD.EFGH dengan panjang rusuk a):
1. Jarak Titik ke Titik:
   - Diagonal Bidang (misal AF, BD, EG) = a√2
   - Diagonal Ruang (misal AG, BH, CE) = a√3

2. Jarak Titik ke Garis:
   Tentukan proyeksi tegak lurus dari titik tersebut ke garis tujuan.
   Seringkali diselesaikan dengan bantuan segitiga siku-siku atau segitiga sama kaki dan perbandingan luas:
   L = 1/2 × alas₁ × tinggi₁ = 1/2 × alas₂ × tinggi₂

3. Jarak Titik ke Bidang:
   Jarak titik P ke bidang α adalah panjang ruas garis tegak lurus yang menghubungkan titik P ke titik proyeksinya di bidang α.
   Contoh pada kubus:
   - Jarak titik sudut ke bidang diagonal terdekat = 1/3 × diagonal ruang = 1/3 a√3
   - Jarak titik sudut ke bidang seberang = 2/3 a√3`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ==========================================
  // KURSUS 3: Kalkulus Dasar SMA
  // ==========================================
  const course3 = await prisma.course.create({
    data: {
      title: "Kalkulus Dasar SMA: Limit, Turunan & Integral Aljabar",
      slug: "kalkulus-dasar-sma",
      subtitle: "Kupas tuntas konsep limit fungsi aljabar, teknik diferensial turunan fungsi, aplikasi nilai optimum, dan kalkulus integral.",
      description: `Kalkulus adalah mata pelajaran matematika SMA dengan bobot tertinggi dalam penalaran matematika lanjutan. Pelajari metode faktorisasi limit, perkalian sekawan, dalil L'Hopital, turunan fungsi f'(x), tafsiran geometris garis singgung, titik stasioner, serta integral tak tentu dan integral tentu untuk menghitung luas daerah di bawah kurva.`,
      thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "ADVANCED",
      isPublished: true,
      requirements: "Aljabar fungsi, pemfaktoran, dan gradien garis lurus.",
      objectives: "Menyelesaikan limit bentuk tak tentu 0/0; Menghitung turunan f'(x); Menentukan titik stasioner dan nilai maksimum; Menghitung integral tentu luas daerah.",
      instructorId: pengajar1.id,
      categoryId: catKalkulus.id,
      sections: {
        create: [
          {
            title: "Modul 1: Limit Fungsi Aljabar",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Konsep Limit & Bentuk Tak Tentu 0/0",
                  duration: 510,
                  order: 1,
                  isPreview: true,
                  description: `Notasi: lim (x→c) f(x) = L berarti ketika x mendekati c, nilai f(x) mendekati L.

Metode Penyelesaian Limit Aljabar x mendekati nilai tertentu:
1. Substitusi Langsung: Jika hasilnya angka riil (terdefinisi), itulah jawabannya.
2. Bentuk Tak Tentu (0/0): Harus diubah bentuknya terlebih dahulu melalui:
   - Pemfaktoran: Faktorkan pembilang dan penyebut, coret faktor pembuat nol (x - c).
   - Perkalian Sekawan: Khusus limit yang memuat bentuk akar, kalikan dengan sekawan pembilang/penyebut.
   - Dalil L'Hopital: Jika lim f(x)/g(x) = 0/0, maka lim f(x)/g(x) = lim f'(x)/g'(x).

Limit Mendekati Tak Hingga (x→∞):
lim (x→∞) (axᵐ + ...) / (bxⁿ + ...):
- Jika m > n, hasilnya = ∞ (atau -∞)
- Jika m = n, hasilnya = a / b
- Jika m < n, hasilnya = 0

Bentuk Akar Selisih: lim (x→∞) [√(ax² + bx + c) - √(ax² + px + q)] = (b - p) / (2√a).`,
                },
              ],
            },
          },
          {
            title: "Modul 2: Turunan (Diferensial) & Aplikasi",
            order: 2,
            lessons: {
              create: [
                {
                  title: "2. Rumus Turunan Fungsi Aljabar",
                  duration: 540,
                  order: 1,
                  isPreview: false,
                  description: `Definisi Formal: f'(x) = lim (h→0) [f(x + h) - f(x)] / h.

Rumus Dasar Turunan Aljabar:
1. Jika f(x) = k (konstanta), maka f'(x) = 0
2. Jika f(x) = xⁿ, maka f'(x) = n × xⁿ⁻¹
3. Jika f(x) = k × xⁿ, maka f'(x) = k × n × xⁿ⁻¹

Aturan Operasi Turunan:
- Penjumlahan/Pengurangan: (u ± v)' = u' ± v'
- Perkalian: (u × v)' = u'v + uv'
- Pembagian: (u / v)' = (u'v - uv') / v²
- Aturan Rantai: y = [u(x)]ⁿ → y' = n × [u(x)]ⁿ⁻¹ × u'(x)

Aplikasi Turunan:
- Gradien Garis Singgung Kurva di titik (x₁, y₁): m = f'(x₁)
- Persamaan Garis Singgung: y - y₁ = m(x - x₁)`,
                },
                {
                  title: "3. Titik Stasioner, Nilai Maksimum & Minimum",
                  duration: 600,
                  order: 2,
                  isPreview: false,
                  description: `Syarat Titik Stasioner: f'(x) = 0.

Analisis Fungsi dengan Turunan:
- Fungsi Naik pada interval di mana f'(x) > 0
- Fungsi Turun pada interval di mana f'(x) < 0
- Titik Stasioner terjadi saat f'(x) = 0

Uji Turunan Kedua untuk Titik Balik:
Misal f'(a) = 0:
- f''(a) < 0: Titik balik Maksimum lokal (nilai maksimum = f(a))
- f''(a) > 0: Titik balik Minimum lokal (nilai minimum = f(a))
- f''(a) = 0: Uji turunan kedua gagal (gunakan tanda f'(x) di kiri dan kanan).

Penerapan Masalah Nyata Optimum:
Menentukan luas maksimum kandang, volume kotak terbesar, atau biaya produksi minimum dengan membuat model fungsi dan mencari f'(x) = 0.`,
                },
              ],
            },
          },
          {
            title: "Modul 3: Integral Tak Tentu & Integral Tentu",
            order: 3,
            lessons: {
              create: [
                {
                  title: "4. Integral Aljabar & Luas Daerah",
                  duration: 630,
                  order: 1,
                  isPreview: false,
                  description: `Integral adalah antiturunan (kebalikan dari diferensial).

1. Integral Tak Tentu:
- ∫ xⁿ dx = (1 / (n + 1)) × xⁿ⁺¹ + C (syarat n ≠ -1)
- ∫ k × xⁿ dx = (k / (n + 1)) × xⁿ⁺¹ + C
- ∫ (u ± v) dx = ∫ u dx ± ∫ v dx

2. Integral Tentu (Teorema Dasar Kalkulus):
∫[a ke b] f(x) dx = [F(x)][a ke b] = F(b) - F(a), dengan F'(x) = f(x).

Sifat-Sifat Integral Tentu:
- ∫[a ke a] f(x) dx = 0
- ∫[a ke b] f(x) dx = - ∫[b ke a] f(x) dx
- ∫[a ke c] f(x) dx = ∫[a ke b] f(x) dx + ∫[b ke c] f(x) dx

3. Menghitung Luas Daerah:
- Luas daerah antara kurva y = f(x) dan sumbu X dari x = a ke b:
  L = ∫[a ke b] f(x) dx (jika kurva berada di atas sumbu X)
- Luas antara dua kurva y₁ dan y₂:
  L = ∫[a ke b] (y_atas - y_bawah) dx
- Rumus Cepat Luas antara Kurva Parabola dan Garis:
  L = (D√D) / (6a²), di mana D adalah diskriminan persamaan sekutu parabola dan garis.`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ==========================================
  // KURSUS 4: Statistika & Peluang SMA
  // ==========================================
  const course4 = await prisma.course.create({
    data: {
      title: "Statistika & Peluang SMA: Analisis Data hingga Kombinatorika",
      slug: "statistika-peluang-sma",
      subtitle: "Kuasai ukuran pemusatan dan penyebaran data kelompok, aturan perkalian, permutasi, kombinasi, dan peluang kejadian bersyarat.",
      description: `Statistika dan teori peluang adalah cabang matematika terapan yang sangat aplikatif di dunia sains, ekonomi, dan riset modern. Kursus ini memandu Anda memahami mean, median, modus data berkelompok, ragam (varians), standar deviasi, aturan pengisian tempat (filling slot), perbedaan mendasar permutasi vs kombinasi, hingga hukum peluang saling lepas dan saling bebas.`,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "Operasi pecahan, desimal, dan perbandingan dasar.",
      objectives: "Menghitung median dan modus data kelompok; Menguasai faktorial, permutasi dan kombinasi; Menghitung peluang kejadian majemuk.",
      instructorId: pengajar2.id,
      categoryId: catStatistika.id,
      sections: {
        create: [
          {
            title: "Modul 1: Statistika Data Kelompok",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Ukuran Pemusatan: Mean, Median, & Modus Data Kelompok",
                  duration: 560,
                  order: 1,
                  isPreview: true,
                  description: `Data berkelompok disajikan dalam tabel distribusi frekuensi dengan interval kelas.

1. Rata-Rata (Mean / x̄):
x̄ = (∑ fᵢ × xᵢ) / (∑ fᵢ)
di mana xᵢ adalah titik tengah kelas ke-i: xᵢ = 1/2 × (Batas Bawah + Batas Atas).

2. Median (Me / Nilai Tengah):
Me = Tb + [ (1/2 N - Fk) / f_me ] × p
- Tb = Tepi bawah kelas median (Batas Bawah - 0,5)
- N = Total seluruh frekuensi data
- Fk = Jumlah frekuensi kumulatif sebelum kelas median
- f_me = Frekuensi kelas median
- p = Panjang interval kelas

3. Modus (Mo / Nilai yang Paling Sering Muncul):
Mo = Tb + [ d₁ / (d₁ + d₂) ] × p
- Tb = Tepi bawah kelas modus (kelas dengan frekuensi tertinggi)
- d₁ = Selisih frekuensi kelas modus dengan kelas sebelumnya
- d₂ = Selisih frekuensi kelas modus dengan kelas setelahnya
- p = Panjang kelas`,
                },
                {
                  title: "2. Ukuran Penyebaran: Jangkauan, Ragam & Standar Deviasi",
                  duration: 520,
                  order: 2,
                  isPreview: false,
                  description: `Ukuran penyebaran mengukur seberapa jauh data tersebar dari nilai pusatnya.

1. Kuartil (Q₁, Q₂, Q₃):
Qᵢ = Tb + [ (i/4 N - Fk) / f_qi ] × p

2. Jangkauan Interkuartil (Hamparan / H):
H = Q₃ - Q₁

3. Simpangan Kuartil (Qd):
Qd = 1/2 × H = 1/2 × (Q₃ - Q₁)

4. Ragam / Varians (S²):
S² = (∑ fᵢ × (xᵢ - x̄)²) / N

5. Simpangan Baku / Standar Deviasi (S):
S = √(S²) = √[ (∑ fᵢ × (xᵢ - x̄)²) / N ]`,
                },
              ],
            },
          },
          {
            title: "Modul 2: Kaidah Pencacahan & Teori Peluang",
            order: 2,
            lessons: {
              create: [
                {
                  title: "3. Kaidah Pencacahan: Permutasi vs Kombinasi",
                  duration: 610,
                  order: 1,
                  isPreview: false,
                  description: `Aturan Perkalian (Filling Slots):
Jika suatu kejadian dapat terjadi dalam k₁ cara, kejadian kedua k₂ cara, ..., maka seluruh kejadian berurutan dapat terjadi dalam (k₁ × k₂ × ... × kₙ) cara.

Notasi Faktorial:
n! = n × (n - 1) × (n - 2) × ... × 2 × 1. Catatan penting: 0! = 1.

PERMUTASI (MEMPERHATIKAN URUTAN: AB ≠ BA):
Digunakan untuk pemilihan juara 1-2-3, ketua-sekretaris-bendahara, nomor antrean, dsb.
- P(n, r) = n! / (n - r)!
- Permutasi dengan Unsur Sama: P = n! / (k₁! × k₂! × ... × kₘ!)
- Permutasi Siklis (Melingkar): P_siklis = (n - 1)!

KOMBINASI (TIDAK MEMPERHATIKAN URUTAN: AB = BA):
Digunakan untuk memilih anggota tim, mengambil bola dari kantong, memilih soal ujian, dsb.
- C(n, r) = n! / [ r! × (n - r)! ]`,
                },
                {
                  title: "4. Peluang Kejadian Tunggal & Majemuk",
                  duration: 640,
                  order: 2,
                  isPreview: false,
                  description: `Peluang Suatu Kejadian A:
P(A) = n(A) / n(S), dengan rentang 0 ≤ P(A) ≤ 1.
- P(A) = 0: Kejadian mustahil
- P(A) = 1: Kejadian pasti
- Peluang Komplemen: P(A') = 1 - P(A)

Frekuensi Harapan (Fh):
Fh(A) = n × P(A), di mana n adalah banyaknya percobaan.

Peluang Kejadian Majemuk:
1. Peluang Gabungan Dua Kejadian:
   P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
2. Saling Lepas (A dan B tidak bisa terjadi bersamaan, A ∩ B = ∅):
   P(A ∪ B) = P(A) + P(B)
3. Saling Bebas (kejadian A tidak mempengaruhi peluang kejadian B):
   P(A ∩ B) = P(A) × P(B)
4. Bersyarat (peluang A terjadi dengan syarat B telah terjadi):
   P(A|B) = P(A ∩ B) / P(B)`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ==========================================
  // KURSUS 5: Matriks & Transformasi Geometri
  // ==========================================
  const course5 = await prisma.course.create({
    data: {
      title: "Matriks & Transformasi Geometri SMA: Aljabar Linier & Pemetaan",
      slug: "matriks-transformasi-geometri-sma",
      subtitle: "Pelajari operasi aljabar matriks, determinan, invers, dan pemetaan transformasi translasi, refleksi, rotasi, serta dilatasi.",
      description: `Matriks menyederhanakan penyelesaian sistem persamaan linier dan merepresentasikan perubahan posisi titik pada bidang kartesius melalui transformasi geometri. Kursus ini membahas tuntas ordo matriks, perkalian matriks baris-kali-kolom, determinan ordo 2x2 dan 3x3 (metode Sarrus), matriks invers, serta matriks pemetaan translasi T(a,b), refleksi garis, rotasi sudut θ, dan dilatasi pusat faktor k.`,
      thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "Sistem koordinat kartesius dan persamaan garis lurus.",
      objectives: "Mengalikan matriks; Menghitung invers matriks 2x2; Menyelesaikan SPLDV dengan determinan matriks; Menentukan bayangan titik hasil rotasi dan refleksi.",
      instructorId: pengajar1.id,
      categoryId: catMatriks.id,
      sections: {
        create: [
          {
            title: "Modul 1: Operasi Aljabar Matriks & Invers",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Konsep Matriks, Penjumlahan & Perkalian",
                  duration: 520,
                  order: 1,
                  isPreview: true,
                  description: `Matriks adalah susunan bilangan berbentuk persegi panjang yang diatur menurut baris dan kolom.

Ordo Matriks: m × n (m baris, n kolom).

Operasi Dasar:
1. Penjumlahan & Pengurangan:
   Hanya bisa dilakukan pada matriks dengan ordo sama. Setiap elemen seletak dijumlahkan atau dikurangkan.
2. Perkalian Skalar (k × A):
   Setiap elemen pada matriks dikalikan dengan konstanta k.
3. Perkalian Dua Matriks (A × B):
   Syarat: Banyaknya kolom matriks A harus sama dengan banyaknya baris matriks B.
   Ordo: (m × p) × (p × n) menghasilkan matriks berordo (m × n).
   Metode: Baris pada matriks pertama dikalikan dengan Kolom pada matriks kedua.
   Sifat penting: Perkalian matriks TIDAK komutatif (A × B ≠ B × A).`,
                },
                {
                  title: "2. Determinan & Invers Matriks",
                  duration: 580,
                  order: 2,
                  isPreview: false,
                  description: `Determinan Matriks Ordo 2x2:
Misalkan A = [a  b; c  d], maka:
det(A) = |A| = (a × d) - (b × c)
- Jika det(A) = 0, matriks disebut Matriks Singular (tidak memiliki invers).
- Jika det(A) ≠ 0, matriks disebut Non-Singular.

Invers Matriks Ordo 2x2 (A⁻¹):
A⁻¹ = (1 / det(A)) × [d  -b; -c  a]

Sifat-Sifat Matriks Invers & Determinan:
- A × A⁻¹ = A⁻¹ × A = I (Matriks Identitas)
- (A × B)⁻¹ = B⁻¹ × A⁻¹
- det(A × B) = det(A) × det(B)
- det(A⁻¹) = 1 / det(A)
- det(Aᵀ) = det(A)

Menyelesaikan Persamaan Matriks:
- A × X = B ⇔ X = A⁻¹ × B
- X × A = B ⇔ X = B × A⁻¹`,
                },
              ],
            },
          },
          {
            title: "Modul 2: Transformasi Geometri Bidang Datar",
            order: 2,
            lessons: {
              create: [
                {
                  title: "3. Translasi & Refleksi",
                  duration: 610,
                  order: 1,
                  isPreview: false,
                  description: `Transformasi geometri memindahkan posisi titik P(x, y) menjadi bayangan P'(x', y').

1. Translasi (Pergeseran) oleh T = (a, b):
[x'; y'] = [x; y] + [a; b] → x' = x + a, y' = y + b.

2. Refleksi (Pencerminan):
- Terhadap Sumbu X: (x, -y) → Matriks: [1  0; 0 -1]
- Terhadap Sumbu Y: (-x, y) → Matriks: [-1 0; 0  1]
- Terhadap Titik Asal O(0,0): (-x, -y) → Matriks: [-1 0; 0 -1]
- Terhadap Garis y = x: (y, x) → Matriks: [0  1; 1  0]
- Terhadap Garis y = -x: (-y, -x) → Matriks: [0 -1; -1 0]
- Terhadap Garis x = h: (2h - x, y)
- Terhadap Garis y = k: (x, 2k - y)`,
                },
                {
                  title: "4. Rotasi, Dilatasi & Komposisi Transformasi",
                  duration: 650,
                  order: 2,
                  isPreview: false,
                  description: `1. Rotasi (Perputaran) terhadap pusat O(0,0) sebesar sudut θ (berlawanan jarum jam):
[x'; y'] = [cos θ  -sin θ; sin θ   cos θ] × [x; y]
- Rotasi 90°: [-y; x]
- Rotasi 180°: [-x; -y]
- Rotasi 270° (atau -90°): [y; -x]

2. Dilatasi (Perbesaran/Pengecilan) dengan faktor skala k:
- Pusat O(0,0): [x'; y'] = [k  0; 0  k] × [x; y] = [kx; ky]
- Pusat P(a, b): x' - a = k(x - a) dan y' - b = k(y - b)

3. Komposisi Transformasi:
Jika transformasi T₁ memiliki matriks M₁ dan T₂ memiliki matriks M₂, maka bayangan oleh transformasi T₁ dilanjutkan T₂ (T₂ ∘ T₁) dihitung dengan:
M_total = M₂ × M₁
[x'; y'] = (M₂ × M₁) × [x; y]`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ 5 Kursus Matematika SMA berhasil dibuat beserta materi tertulis");

  // =========================================================================
  // HELPER FUNCTION: PEMBUATAN 15 SOAL KUIS PILIHAN GANDA TERSTRUKTUR
  // =========================================================================
  async function create15QuestionsQuiz(courseId, title, description, questionsData) {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        passingScore: 75, // Sesuai syarat passing grade minimal 75%
        courseId,
      },
    });

    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          text: q.text,
          order: i + 1,
          weight: 1,
          explanation: q.explanation,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
    }

    return quiz;
  }

  // ==========================================
  // KUIS 1: Aljabar & Fungsi SMA (15 Soal)
  // ==========================================
  const qDataCourse1 = [
    {
      text: "Akar-akar persamaan kuadrat x² - 5x + 6 = 0 adalah...",
      explanation: "Faktorisasi (x - 2)(x - 3) = 0 menghasilkan x = 2 atau x = 3.",
      options: [
        { text: "x = 2 atau x = 3", isCorrect: true },
        { text: "x = -2 atau x = -3", isCorrect: false },
        { text: "x = 1 atau x = 6", isCorrect: false },
        { text: "x = -1 atau x = -6", isCorrect: false },
      ],
    },
    {
      text: "Jika x₁ dan x₂ adalah akar-akar dari 2x² - 6x + 8 = 0, maka nilai dari x₁ + x₂ adalah...",
      explanation: "Berdasarkan teorema Vieta, x₁ + x₂ = -b/a = -(-6)/2 = 3.",
      options: [
        { text: "3", isCorrect: true },
        { text: "-3", isCorrect: false },
        { text: "4", isCorrect: false },
        { text: "-4", isCorrect: false },
      ],
    },
    {
      text: "Nilai diskriminan dari persamaan kuadrat 3x² - 4x + 2 = 0 adalah...",
      explanation: "D = b² - 4ac = (-4)² - 4(3)(2) = 16 - 24 = -8.",
      options: [
        { text: "-8", isCorrect: true },
        { text: "8", isCorrect: false },
        { text: "40", isCorrect: false },
        { text: "-40", isCorrect: false },
      ],
    },
    {
      text: "Jika diskriminan D < 0, maka karakteristik akar persamaan kuadrat adalah...",
      explanation: "D < 0 mengindikasikan bahwa persamaan kuadrat tidak memiliki akar real (akar imajiner).",
      options: [
        { text: "Tidak memiliki akar real (akar imajiner)", isCorrect: true },
        { text: "Dua akar real berbeda", isCorrect: false },
        { text: "Dua akar real kembar", isCorrect: false },
        { text: "Akar-akarnya selalu rasional", isCorrect: false },
      ],
    },
    {
      text: "Koordinat titik puncak dari parabola f(x) = x² - 4x + 7 adalah...",
      explanation: "Xp = -b/(2a) = 4/2 = 2. Yp = f(2) = 2² - 4(2) + 7 = 4 - 8 + 7 = 3. Titik puncak adalah (2, 3).",
      options: [
        { text: "(2, 3)", isCorrect: true },
        { text: "(-2, 3)", isCorrect: false },
        { text: "(2, -3)", isCorrect: false },
        { text: "(4, 7)", isCorrect: false },
      ],
    },
    {
      text: "Bentuk sederhana dari (2³ × 2⁴) / 2² adalah...",
      explanation: "2³⁺⁴⁻² = 2⁵ = 32.",
      options: [
        { text: "32", isCorrect: true },
        { text: "16", isCorrect: false },
        { text: "64", isCorrect: false },
        { text: "8", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari ²log 16 + ²log 4 adalah...",
      explanation: "²log 16 = 4 dan ²log 4 = 2. 4 + 2 = 6 (atau ²log(16 × 4) = ²log 64 = 6).",
      options: [
        { text: "6", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "8", isCorrect: false },
        { text: "4", isCorrect: false },
      ],
    },
    {
      text: "Jika ³log 5 = p, maka nilai dari ³log 25 adalah...",
      explanation: "³log 25 = ³log 5² = 2 × ³log 5 = 2p.",
      options: [
        { text: "2p", isCorrect: true },
        { text: "p²", isCorrect: false },
        { text: "5p", isCorrect: false },
        { text: "p + 2", isCorrect: false },
      ],
    },
    {
      text: "Rasionalkan bentuk pecahan 6 / √3 ...",
      explanation: "6 / √3 × (√3 / √3) = (6√3) / 3 = 2√3.",
      options: [
        { text: "2√3", isCorrect: true },
        { text: "3√3", isCorrect: false },
        { text: "√3", isCorrect: false },
        { text: "6√3", isCorrect: false },
      ],
    },
    {
      text: "Jika f(x) = 2x + 1 dan g(x) = x² - 3, maka nilai dari (g ∘ f)(1) adalah...",
      explanation: "f(1) = 2(1) + 1 = 3. g(f(1)) = g(3) = 3² - 3 = 9 - 3 = 6.",
      options: [
        { text: "6", isCorrect: true },
        { text: "-1", isCorrect: false },
        { text: "3", isCorrect: false },
        { text: "8", isCorrect: false },
      ],
    },
    {
      text: "Invers dari fungsi f(x) = (3x - 2) / 5 adalah...",
      explanation: "y = (3x - 2)/5 → 5y = 3x - 2 → 3x = 5y + 2 → x = (5y + 2)/3. Jadi f⁻¹(x) = (5x + 2) / 3.",
      options: [
        { text: "(5x + 2) / 3", isCorrect: true },
        { text: "(5x - 2) / 3", isCorrect: false },
        { text: "(3x + 2) / 5", isCorrect: false },
        { text: "(3x - 5) / 2", isCorrect: false },
      ],
    },
    {
      text: "Sisa pembagian polinomial P(x) = x³ - 2x² + 5x - 4 oleh (x - 1) adalah...",
      explanation: "Berdasarkan Teorema Sisa, sisa = P(1) = 1³ - 2(1)² + 5(1) - 4 = 1 - 2 + 5 - 4 = 0.",
      options: [
        { text: "0", isCorrect: true },
        { text: "2", isCorrect: false },
        { text: "-4", isCorrect: false },
        { text: "4", isCorrect: false },
      ],
    },
    {
      text: "Jika log 2 = a dan log 3 = b, maka nilai log 18 adalah...",
      explanation: "log 18 = log (2 × 3²) = log 2 + 2 log 3 = a + 2b.",
      options: [
        { text: "a + 2b", isCorrect: true },
        { text: "2a + b", isCorrect: false },
        { text: "a² + b", isCorrect: false },
        { text: "2(a + b)", isCorrect: false },
      ],
    },
    {
      text: "Persamaan kuadrat yang akar-akarnya 3 dan -4 adalah...",
      explanation: "(x - 3)(x - (-4)) = (x - 3)(x + 4) = x² + x - 12 = 0.",
      options: [
        { text: "x² + x - 12 = 0", isCorrect: true },
        { text: "x² - x - 12 = 0", isCorrect: false },
        { text: "x² + 7x + 12 = 0", isCorrect: false },
        { text: "x² - 7x - 12 = 0", isCorrect: false },
      ],
    },
    {
      text: "Himpunan penyelesaian dari 2^(2x - 1) = 32 adalah...",
      explanation: "2^(2x - 1) = 2⁵ → 2x - 1 = 5 → 2x = 6 → x = 3.",
      options: [
        { text: "x = 3", isCorrect: true },
        { text: "x = 2", isCorrect: false },
        { text: "x = 4", isCorrect: false },
        { text: "x = 5", isCorrect: false },
      ],
    },
  ];

  // ==========================================
  // KUIS 2: Geometri & Trigonometri SMA (15 Soal)
  // ==========================================
  const qDataCourse2 = [
    {
      text: "Nilai dari sin 30° + cos 60° adalah...",
      explanation: "sin 30° = 1/2 dan cos 60° = 1/2. Maka 1/2 + 1/2 = 1.",
      options: [
        { text: "1", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "√3", isCorrect: false },
        { text: "0", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari tan 45° adalah...",
      explanation: "tan 45° = sin 45° / cos 45° = (1/2√2) / (1/2√2) = 1.",
      options: [
        { text: "1", isCorrect: true },
        { text: "0", isCorrect: false },
        { text: "√3", isCorrect: false },
        { text: "1/2", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari cos 120° adalah...",
      explanation: "120° di Kuadran II (Cosinus bernilai negatif): cos(180° - 60°) = -cos 60° = -1/2.",
      options: [
        { text: "-1/2", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "-1/2√3", isCorrect: false },
        { text: "1/2√3", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari sin 150° adalah...",
      explanation: "150° di Kuadran II: sin(180° - 30°) = sin 30° = 1/2.",
      options: [
        { text: "1/2", isCorrect: true },
        { text: "-1/2", isCorrect: false },
        { text: "1/2√3", isCorrect: false },
        { text: "-1/2√3", isCorrect: false },
      ],
    },
    {
      text: "Bentuk sederhana dari (1 - cos² θ) / sin θ adalah...",
      explanation: "Karena sin² θ + cos² θ = 1, maka 1 - cos² θ = sin² θ. sin² θ / sin θ = sin θ.",
      options: [
        { text: "sin θ", isCorrect: true },
        { text: "cos θ", isCorrect: false },
        { text: "tan θ", isCorrect: false },
        { text: "1", isCorrect: false },
      ],
    },
    {
      text: "Pada segitiga ABC, diketahui sisi b = 8 cm, c = 6 cm, dan sudut A = 60°. Panjang sisi a adalah...",
      explanation: "a² = b² + c² - 2bc cos A = 64 + 36 - 2(8)(6)(1/2) = 100 - 48 = 52. a = √52 = 2√13 cm.",
      options: [
        { text: "2√13 cm", isCorrect: true },
        { text: "4√3 cm", isCorrect: false },
        { text: "10 cm", isCorrect: false },
        { text: "12 cm", isCorrect: false },
      ],
    },
    {
      text: "Pada segitiga ABC, sudut A = 30°, sudut B = 45°, dan sisi a = 4 cm. Panjang sisi b adalah...",
      explanation: "Aturan Sinus: a / sin A = b / sin B → 4 / (1/2) = b / (1/2√2) → 8 = b / (1/2√2) → b = 4√2 cm.",
      options: [
        { text: "4√2 cm", isCorrect: true },
        { text: "2√2 cm", isCorrect: false },
        { text: "8 cm", isCorrect: false },
        { text: "4√3 cm", isCorrect: false },
      ],
    },
    {
      text: "Luas segitiga yang memiliki sisi a = 6 cm, b = 10 cm, dan sudut apit C = 30° adalah...",
      explanation: "L = 1/2 × a × b × sin C = 1/2 × 6 × 10 × sin 30° = 30 × 1/2 = 15 cm².",
      options: [
        { text: "15 cm²", isCorrect: true },
        { text: "30 cm²", isCorrect: false },
        { text: "15√3 cm²", isCorrect: false },
        { text: "20 cm²", isCorrect: false },
      ],
    },
    {
      text: "Pada kubus ABCD.EFGH dengan panjang rusuk 6 cm, panjang diagonal ruang AG adalah...",
      explanation: "Diagonal ruang kubus dengan rusuk a adalah a√3. Dengan a = 6, maka AG = 6√3 cm.",
      options: [
        { text: "6√3 cm", isCorrect: true },
        { text: "6√2 cm", isCorrect: false },
        { text: "12 cm", isCorrect: false },
        { text: "18 cm", isCorrect: false },
      ],
    },
    {
      text: "Pada kubus ABCD.EFGH dengan rusuk 8 cm, panjang diagonal bidang BD adalah...",
      explanation: "Diagonal bidang kubus dengan rusuk a adalah a√2 = 8√2 cm.",
      options: [
        { text: "8√2 cm", isCorrect: true },
        { text: "8√3 cm", isCorrect: false },
        { text: "16 cm", isCorrect: false },
        { text: "4√2 cm", isCorrect: false },
      ],
    },
    {
      text: "Jika tan α = 3/4 dengan α di kuadran I, maka nilai dari sin α adalah...",
      explanation: "Sisi depan = 3, sisi samping = 4. Sisi miring = √(3² + 4²) = 5. sin α = 3/5.",
      options: [
        { text: "3/5", isCorrect: true },
        { text: "4/5", isCorrect: false },
        { text: "3/4", isCorrect: false },
        { text: "5/3", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari sin 240° adalah...",
      explanation: "240° di Kuadran III (Sinus negatif): sin(180° + 60°) = -sin 60° = -1/2√3.",
      options: [
        { text: "-1/2√3", isCorrect: true },
        { text: "1/2√3", isCorrect: false },
        { text: "-1/2", isCorrect: false },
        { text: "-√3", isCorrect: false },
      ],
    },
    {
      text: "Periode dari fungsi trigonometri f(x) = sin(2x) adalah...",
      explanation: "Periode fungsi sin(kx) adalah 360° / k. Untuk k = 2, periodenya adalah 360° / 2 = 180°.",
      options: [
        { text: "180°", isCorrect: true },
        { text: "360°", isCorrect: false },
        { text: "90°", isCorrect: false },
        { text: "720°", isCorrect: false },
      ],
    },
    {
      text: "Jarak titik B ke bidang ACGE pada kubus ABCD.EFGH dengan rusuk 4 cm adalah...",
      explanation: "Proyeksi B ke bidang ACGE jatuh tepat di perpotongan diagonal AC dan BD (titik O). Panjang BO = 1/2 BD = 1/2(4√2) = 2√2 cm.",
      options: [
        { text: "2√2 cm", isCorrect: true },
        { text: "4√2 cm", isCorrect: false },
        { text: "2√3 cm", isCorrect: false },
        { text: "4 cm", isCorrect: false },
      ],
    },
    {
      text: "Himpunan penyelesaian dari sin x = 1/2 untuk 0° ≤ x ≤ 360° adalah...",
      explanation: "sin x = 1/2 bernilai positif di Kuadran I (30°) dan Kuadran II (180° - 30° = 150°).",
      options: [
        { text: "{30°, 150°}", isCorrect: true },
        { text: "{30°, 60°}", isCorrect: false },
        { text: "{60°, 120°}", isCorrect: false },
        { text: "{30°, 210°}", isCorrect: false },
      ],
    },
  ];

  // ==========================================
  // KUIS 3: Kalkulus Dasar SMA (15 Soal)
  // ==========================================
  const qDataCourse3 = [
    {
      text: "Nilai dari lim (x→2) (x² - 4) / (x - 2) adalah...",
      explanation: "Faktorisasi: (x - 2)(x + 2) / (x - 2) = x + 2. Substitusi x = 2 menghasilkan 2 + 2 = 4.",
      options: [
        { text: "4", isCorrect: true },
        { text: "0", isCorrect: false },
        { text: "2", isCorrect: false },
        { text: "Tak terdefinisi", isCorrect: false },
      ],
    },
    {
      text: "Turunan pertama dari f(x) = 4x³ - 5x² + 7x - 9 adalah...",
      explanation: "f'(x) = 4(3)x² - 5(2)x + 7 = 12x² - 10x + 7.",
      options: [
        { text: "12x² - 10x + 7", isCorrect: true },
        { text: "12x² - 5x + 7", isCorrect: false },
        { text: "4x² - 10x + 7", isCorrect: false },
        { text: "12x² - 10x", isCorrect: false },
      ],
    },
    {
      text: "Jika f(x) = 5x⁴, maka f'(2) bernilai...",
      explanation: "f'(x) = 20x³. f'(2) = 20(2)³ = 20(8) = 160.",
      options: [
        { text: "160", isCorrect: true },
        { text: "80", isCorrect: false },
        { text: "40", isCorrect: false },
        { text: "320", isCorrect: false },
      ],
    },
    {
      text: "Gradien garis singgung kurva y = x² - 3x + 2 di titik (2, 0) adalah...",
      explanation: "m = y' = 2x - 3. Di x = 2, m = 2(2) - 3 = 1.",
      options: [
        { text: "1", isCorrect: true },
        { text: "-1", isCorrect: false },
        { text: "2", isCorrect: false },
        { text: "3", isCorrect: false },
      ],
    },
    {
      text: "Titik stasioner dari fungsi f(x) = x³ - 3x² + 5 terjadi saat x bernilai...",
      explanation: "f'(x) = 3x² - 6x = 0 → 3x(x - 2) = 0 → x = 0 atau x = 2.",
      options: [
        { text: "x = 0 atau x = 2", isCorrect: true },
        { text: "x = 1 atau x = -1", isCorrect: false },
        { text: "x = 0 atau x = -2", isCorrect: false },
        { text: "x = 2 atau x = 3", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari ∫ (3x² + 4x - 1) dx adalah...",
      explanation: "∫ 3x² dx = x³, ∫ 4x dx = 2x², ∫ -1 dx = -x. Hasil = x³ + 2x² - x + C.",
      options: [
        { text: "x³ + 2x² - x + C", isCorrect: true },
        { text: "3x³ + 4x² - x + C", isCorrect: false },
        { text: "6x + 4 + C", isCorrect: false },
        { text: "x³ + 4x² - x + C", isCorrect: false },
      ],
    },
    {
      text: "Nilai integral tentu ∫[0 ke 2] 3x² dx adalah...",
      explanation: "[x³][0 ke 2] = 2³ - 0³ = 8.",
      options: [
        { text: "8", isCorrect: true },
        { text: "12", isCorrect: false },
        { text: "6", isCorrect: false },
        { text: "24", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari lim (x→∞) (4x² + 3x - 1) / (2x² - 5) adalah...",
      explanation: "Pangkat tertinggi pembilang dan penyebut sama (x²). Hasilnya adalah rasio koefisien = 4/2 = 2.",
      options: [
        { text: "2", isCorrect: true },
        { text: "4", isCorrect: false },
        { text: "0", isCorrect: false },
        { text: "∞", isCorrect: false },
      ],
    },
    {
      text: "Turunan dari f(x) = (2x + 1)⁵ adalah...",
      explanation: "Gunakan aturan rantai: f'(x) = 5(2x + 1)⁴ × d/dx(2x + 1) = 5(2x + 1)⁴ × 2 = 10(2x + 1)⁴.",
      options: [
        { text: "10(2x + 1)⁴", isCorrect: true },
        { text: "5(2x + 1)⁴", isCorrect: false },
        { text: "2(2x + 1)⁴", isCorrect: false },
        { text: "10(2x + 1)⁵", isCorrect: false },
      ],
    },
    {
      text: "Jika fungsi posisi benda s(t) = t³ - 6t² + 9t, maka kecepatannya v(t) = 0 pada saat t = ...",
      explanation: "v(t) = s'(t) = 3t² - 12t + 9 = 0 → t² - 4t + 3 = 0 → (t - 1)(t - 3) = 0 → t = 1 atau t = 3.",
      options: [
        { text: "t = 1 atau t = 3", isCorrect: true },
        { text: "t = 2 atau t = 4", isCorrect: false },
        { text: "t = 0 atau t = 3", isCorrect: false },
        { text: "t = 3 atau t = 9", isCorrect: false },
      ],
    },
    {
      text: "Nilai maksimum fungsi kuadrat f(x) = -x² + 6x - 5 adalah...",
      explanation: "Xp = -6 / (2(-1)) = 3. Nilai maksimum = f(3) = -(3²) + 6(3) - 5 = -9 + 18 - 5 = 4.",
      options: [
        { text: "4", isCorrect: true },
        { text: "3", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "9", isCorrect: false },
      ],
    },
    {
      text: "Fungsi f(x) = x³ - 3x² - 9x + 1 naik pada interval...",
      explanation: "f'(x) = 3x² - 6x - 9 > 0 → x² - 2x - 3 > 0 → (x - 3)(x + 1) > 0 → x < -1 atau x > 3.",
      options: [
        { text: "x < -1 atau x > 3", isCorrect: true },
        { text: "-1 < x < 3", isCorrect: false },
        { text: "x < 1 atau x > 3", isCorrect: false },
        { text: "x > 3 saja", isCorrect: false },
      ],
    },
    {
      text: "Nilai integral tentu ∫[1 ke 3] (2x + 1) dx adalah...",
      explanation: "[x² + x][1 ke 3] = (3² + 3) - (1² + 1) = (9 + 3) - (1 + 1) = 12 - 2 = 10.",
      options: [
        { text: "10", isCorrect: true },
        { text: "8", isCorrect: false },
        { text: "12", isCorrect: false },
        { text: "14", isCorrect: false },
      ],
    },
    {
      text: "Luas daerah yang dibatasi oleh kurva y = 3x², sumbu X, garis x = 0 dan x = 2 adalah...",
      explanation: "L = ∫[0 ke 2] 3x² dx = [x³][0 ke 2] = 2³ - 0 = 8 satuan luas.",
      options: [
        { text: "8 satuan luas", isCorrect: true },
        { text: "6 satuan luas", isCorrect: false },
        { text: "12 satuan luas", isCorrect: false },
        { text: "16 satuan luas", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari lim (x→0) (sin 4x) / (2x) adalah...",
      explanation: "Berdasarkan sifat limit trigonometri: lim (x→0) sin(ax) / (bx) = a / b = 4 / 2 = 2.",
      options: [
        { text: "2", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "4", isCorrect: false },
        { text: "0", isCorrect: false },
      ],
    },
  ];

  // ==========================================
  // KUIS 4: Statistika & Peluang SMA (15 Soal)
  // ==========================================
  const qDataCourse4 = [
    {
      text: "Nilai rata-rata (mean) dari data: 6, 8, 7, 9, 10 adalah...",
      explanation: "(6 + 8 + 7 + 9 + 10) / 5 = 40 / 5 = 8.",
      options: [
        { text: "8", isCorrect: true },
        { text: "7,5", isCorrect: false },
        { text: "8,5", isCorrect: false },
        { text: "9", isCorrect: false },
      ],
    },
    {
      text: "Median dari data terurut: 3, 5, 7, 8, 9, 11, 13 adalah...",
      explanation: "Jumlah data n = 7 (ganjil). Median adalah data ke-(7+1)/2 = data ke-4, yaitu 8.",
      options: [
        { text: "8", isCorrect: true },
        { text: "7", isCorrect: false },
        { text: "9", isCorrect: false },
        { text: "7,5", isCorrect: false },
      ],
    },
    {
      text: "Modus dari data: 4, 5, 5, 6, 7, 7, 7, 8, 9 adalah...",
      explanation: "Angka 7 muncul paling sering (sebanyak 3 kali).",
      options: [
        { text: "7", isCorrect: true },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: false },
        { text: "8", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari 5! (5 faktorial) adalah...",
      explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
      options: [
        { text: "120", isCorrect: true },
        { text: "60", isCorrect: false },
        { text: "24", isCorrect: false },
        { text: "720", isCorrect: false },
      ],
    },
    {
      text: "Banyaknya susunan berbeda yang dapat dibentuk dari kata 'BUKU' adalah...",
      explanation: "Total huruf n = 4, huruf 'U' ada 2. P = 4! / 2! = 24 / 2 = 12.",
      options: [
        { text: "12", isCorrect: true },
        { text: "24", isCorrect: false },
        { text: "6", isCorrect: false },
        { text: "4", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari P(5, 2) adalah...",
      explanation: "P(5, 2) = 5! / (5 - 2)! = 5! / 3! = 5 × 4 = 20.",
      options: [
        { text: "20", isCorrect: true },
        { text: "10", isCorrect: false },
        { text: "60", isCorrect: false },
        { text: "5", isCorrect: false },
      ],
    },
    {
      text: "Nilai dari C(6, 2) adalah...",
      explanation: "C(6, 2) = 6! / (2! × 4!) = (6 × 5) / 2 = 15.",
      options: [
        { text: "15", isCorrect: true },
        { text: "30", isCorrect: false },
        { text: "12", isCorrect: false },
        { text: "20", isCorrect: false },
      ],
    },
    {
      text: "Sebuah dadu setimbang dilempar sekali. Peluang munculnya mata dadu prima ganjil (3 atau 5) adalah...",
      explanation: "Mata dadu prima ganjil: {3, 5} ada 2 angka. Ruang sampel n(S) = 6. P = 2/6 = 1/3.",
      options: [
        { text: "1/3", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "1/6", isCorrect: false },
        { text: "2/3", isCorrect: false },
      ],
    },
    {
      text: "Dua keping uang logam dilempar bersamaan. Peluang muncul minimal satu angka (A) adalah...",
      explanation: "Ruang sampel: {AA, AG, GA, GG} total 4. Yang memuat minimal satu angka: {AA, AG, GA} ada 3. P = 3/4.",
      options: [
        { text: "3/4", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "1/4", isCorrect: false },
        { text: "1", isCorrect: false },
      ],
    },
    {
      text: "Dari 7 siswa berprestasi akan dipilih 3 orang untuk delegasi lomba. Banyaknya cara pemilihan adalah...",
      explanation: "Pemilihan delegasi tidak memperhatikan urutan jabatan (Kombinasi): C(7, 3) = 7! / (3! × 4!) = (7 × 6 × 5) / 6 = 35.",
      options: [
        { text: "35", isCorrect: true },
        { text: "210", isCorrect: false },
        { text: "21", isCorrect: false },
        { text: "42", isCorrect: false },
      ],
    },
    {
      text: "Jika peluang hujan hari ini adalah 0,35, maka peluang tidak hujan adalah...",
      explanation: "Peluang komplemen: P(tidak hujan) = 1 - P(hujan) = 1 - 0,35 = 0,65.",
      options: [
        { text: "0,65", isCorrect: true },
        { text: "0,75", isCorrect: false },
        { text: "0,35", isCorrect: false },
        { text: "1,35", isCorrect: false },
      ],
    },
    {
      text: "Sebuah kantong berisi 4 bola merah dan 6 bola putih. Diambil 1 bola acak. Peluang terambil bola merah adalah...",
      explanation: "n(Merah) = 4, total n(S) = 10. Peluang = 4/10 = 2/5.",
      options: [
        { text: "2/5", isCorrect: true },
        { text: "3/5", isCorrect: false },
        { text: "1/4", isCorrect: false },
        { text: "1/2", isCorrect: false },
      ],
    },
    {
      text: "Banyaknya susunan posisi duduk 5 orang yang duduk melingkar mengelilingi meja bundar adalah...",
      explanation: "Permutasi siklis: P = (n - 1)! = (5 - 1)! = 4! = 24 cara.",
      options: [
        { text: "24", isCorrect: true },
        { text: "120", isCorrect: false },
        { text: "60", isCorrect: false },
        { text: "12", isCorrect: false },
      ],
    },
    {
      text: "Sebuah dadu dilempar sebanyak 60 kali. Frekuensi harapan munculnya mata dadu kelipatan 3 (3 atau 6) adalah...",
      explanation: "P(kelipatan 3) = 2/6 = 1/3. Fh = n × P = 60 × (1/3) = 20 kali.",
      options: [
        { text: "20 kali", isCorrect: true },
        { text: "10 kali", isCorrect: false },
        { text: "30 kali", isCorrect: false },
        { text: "15 kali", isCorrect: false },
      ],
    },
    {
      text: "Jangkauan interkuartil (hamparan) dari data dengan Q₁ = 12 dan Q₃ = 25 adalah...",
      explanation: "H = Q₃ - Q₁ = 25 - 12 = 13.",
      options: [
        { text: "13", isCorrect: true },
        { text: "6,5", isCorrect: false },
        { text: "37", isCorrect: false },
        { text: "12,5", isCorrect: false },
      ],
    },
  ];

  // ==========================================
  // KUIS 5: Matriks & Transformasi (15 Soal)
  // ==========================================
  const qDataCourse5 = [
    {
      text: "Jika A = [2  3; 1  4] dan B = [1  2; 3  1], maka nilai A + B adalah...",
      explanation: "Penjumlahan elemen seletak: [2+1  3+2; 1+3  4+1] = [3  5; 4  5].",
      options: [
        { text: "[3  5; 4  5]", isCorrect: true },
        { text: "[2  6; 3  4]", isCorrect: false },
        { text: "[3  1; -2  3]", isCorrect: false },
        { text: "[1  1; 2  3]", isCorrect: false },
      ],
    },
    {
      text: "Determinan dari matriks A = [4  2; 3  1] adalah...",
      explanation: "det(A) = (4)(1) - (2)(3) = 4 - 6 = -2.",
      options: [
        { text: "-2", isCorrect: true },
        { text: "2", isCorrect: false },
        { text: "10", isCorrect: false },
        { text: "-10", isCorrect: false },
      ],
    },
    {
      text: "Invers dari matriks A = [3  1; 5  2] adalah...",
      explanation: "det(A) = (3)(2) - (1)(5) = 6 - 5 = 1. A⁻¹ = (1/1) × [2  -1; -5  3] = [2  -1; -5  3].",
      options: [
        { text: "[2  -1; -5  3]", isCorrect: true },
        { text: "[-2  1; 5  -3]", isCorrect: false },
        { text: "[3  -1; -5  2]", isCorrect: false },
        { text: "[2  1; 5  3]", isCorrect: false },
      ],
    },
    {
      text: "Jika matriks [x  6; 2  3] singular (tidak mempunyai invers), maka nilai x adalah...",
      explanation: "Matriks singular memiliki det = 0 → (x)(3) - (6)(2) = 0 → 3x - 12 = 0 → 3x = 12 → x = 4.",
      options: [
        { text: "4", isCorrect: true },
        { text: "-4", isCorrect: false },
        { text: "6", isCorrect: false },
        { text: "12", isCorrect: false },
      ],
    },
    {
      text: "Hasil perkalian matriks [1  2] berordo 1x2 dengan [3; 4] berordo 2x1 adalah...",
      explanation: "[1(3) + 2(4)] = [3 + 8] = [11] berordo 1x1.",
      options: [
        { text: "[11]", isCorrect: true },
        { text: "[3  8]", isCorrect: false },
        { text: "[7]", isCorrect: false },
        { text: "Matriks tidak dapat dikalikan", isCorrect: false },
      ],
    },
    {
      text: "Titik P(3, -2) ditranslasikan oleh T = (-1, 4). Koordinat bayangannya P' adalah...",
      explanation: "x' = 3 + (-1) = 2, y' = -2 + 4 = 2. Bayangan adalah (2, 2).",
      options: [
        { text: "(2, 2)", isCorrect: true },
        { text: "(4, 2)", isCorrect: false },
        { text: "(2, -6)", isCorrect: false },
        { text: "(-3, -8)", isCorrect: false },
      ],
    },
    {
      text: "Bayangan titik A(5, 2) jika dicerminkan terhadap sumbu X adalah...",
      explanation: "Refleksi terhadap sumbu X: (x, -y) → (5, -2).",
      options: [
        { text: "(5, -2)", isCorrect: true },
        { text: "(-5, 2)", isCorrect: false },
        { text: "(-5, -2)", isCorrect: false },
        { text: "(2, 5)", isCorrect: false },
      ],
    },
    {
      text: "Bayangan titik B(-3, 4) jika dicerminkan terhadap sumbu Y adalah...",
      explanation: "Refleksi terhadap sumbu Y: (-x, y) → (-(-3), 4) = (3, 4).",
      options: [
        { text: "(3, 4)", isCorrect: true },
        { text: "(-3, -4)", isCorrect: false },
        { text: "(3, -4)", isCorrect: false },
        { text: "(4, -3)", isCorrect: false },
      ],
    },
    {
      text: "Bayangan titik C(2, 7) jika dicerminkan terhadap garis y = x adalah...",
      explanation: "Refleksi terhadap garis y = x menukar posisi koordinat: (y, x) → (7, 2).",
      options: [
        { text: "(7, 2)", isCorrect: true },
        { text: "(-2, -7)", isCorrect: false },
        { text: "(-7, -2)", isCorrect: false },
        { text: "(2, -7)", isCorrect: false },
      ],
    },
    {
      text: "Titik D(4, 1) dirotasikan sebesar 90° berlawanan arah jarum jam dengan pusat O(0,0). Bayangannya adalah...",
      explanation: "Rotasi 90°: (x, y) → (-y, x) → (-1, 4).",
      options: [
        { text: "(-1, 4)", isCorrect: true },
        { text: "(1, -4)", isCorrect: false },
        { text: "(4, -1)", isCorrect: false },
        { text: "(-4, -1)", isCorrect: false },
      ],
    },
    {
      text: "Titik E(2, -3) didilatasikan dengan faktor skala k = 3 dan pusat O(0,0). Koordinat bayangannya adalah...",
      explanation: "Dilatasi pusat O: (kx, ky) = (3 × 2, 3 × (-3)) = (6, -9).",
      options: [
        { text: "(6, -9)", isCorrect: true },
        { text: "(5, 0)", isCorrect: false },
        { text: "(6, 9)", isCorrect: false },
        { text: "(-6, 9)", isCorrect: false },
      ],
    },
    {
      text: "Jika A adalah matriks identitas ordo 2x2, maka A adalah...",
      explanation: "Matriks identitas perkalian memiliki angka 1 pada diagonal utama dan 0 di tempat lain: [1 0; 0 1].",
      options: [
        { text: "[1  0; 0  1]", isCorrect: true },
        { text: "[0  1; 1  0]", isCorrect: false },
        { text: "[1  1; 1  1]", isCorrect: false },
        { text: "[0  0; 0  0]", isCorrect: false },
      ],
    },
    {
      text: "Bayangan titik P(2, 5) oleh pencerminan terhadap garis x = 3 adalah...",
      explanation: "x' = 2(h) - x = 2(3) - 2 = 6 - 2 = 4, y' = y = 5. Bayangan = (4, 5).",
      options: [
        { text: "(4, 5)", isCorrect: true },
        { text: "(5, 5)", isCorrect: false },
        { text: "(1, 5)", isCorrect: false },
        { text: "(6, 5)", isCorrect: false },
      ],
    },
    {
      text: "Jika det(A) = 4 dan det(B) = 3, maka nilai dari det(A × B) adalah...",
      explanation: "Sifat determinan: det(A × B) = det(A) × det(B) = 4 × 3 = 12.",
      options: [
        { text: "12", isCorrect: true },
        { text: "7", isCorrect: false },
        { text: "1", isCorrect: false },
        { text: "4/3", isCorrect: false },
      ],
    },
    {
      text: "Transpose dari matriks A = [1  2; 3  4] adalah Aᵀ = ...",
      explanation: "Mengubah baris menjadi kolom: [1  3; 2  4].",
      options: [
        { text: "[1  3; 2  4]", isCorrect: true },
        { text: "[4  3; 2  1]", isCorrect: false },
        { text: "[4  2; 3  1]", isCorrect: false },
        { text: "[1  2; 3  4]", isCorrect: false },
      ],
    },
  ];

  console.log("📝 Membuat 15 soal kuis untuk masing-masing kursus...");
  const quiz1 = await create15QuestionsQuiz(
    course1.id,
    "Kuis Evaluasi Aljabar & Fungsi SMA",
    "Ujian kuis 15 butir soal pilihan ganda. Passing grade kelulusan sertifikat minimal 75%.",
    qDataCourse1
  );

  const quiz2 = await create15QuestionsQuiz(
    course2.id,
    "Kuis Evaluasi Geometri & Trigonometri SMA",
    "Ujian kuis 15 butir soal pilihan ganda. Passing grade kelulusan sertifikat minimal 75%.",
    qDataCourse2
  );

  const quiz3 = await create15QuestionsQuiz(
    course3.id,
    "Kuis Evaluasi Kalkulus Dasar SMA",
    "Ujian kuis 15 butir soal pilihan ganda. Passing grade kelulusan sertifikat minimal 75%.",
    qDataCourse3
  );

  const quiz4 = await create15QuestionsQuiz(
    course4.id,
    "Kuis Evaluasi Statistika & Peluang SMA",
    "Ujian kuis 15 butir soal pilihan ganda. Passing grade kelulusan sertifikat minimal 75%.",
    qDataCourse4
  );

  const quiz5 = await create15QuestionsQuiz(
    course5.id,
    "Kuis Evaluasi Matriks & Transformasi SMA",
    "Ujian kuis 15 butir soal pilihan ganda. Passing grade kelulusan sertifikat minimal 75%.",
    qDataCourse5
  );

  console.log("✅ 5 Kuis dengan masing-masing 15 soal pilihan ganda berhasil dibuat!");

  // ==========================================
  // ENROLLMENT & RIWAYAT HASIL KUIS SISWA
  // ==========================================
  // Murid 1 (Budi): Kursus 1 (Aljabar) & Kursus 3 (Kalkulus)
  await prisma.enrollment.create({
    data: { userId: murid1.id, courseId: course1.id, progress: 100, isCompleted: true, completedAt: new Date() },
  });
  await prisma.enrollment.create({
    data: { userId: murid1.id, courseId: course3.id, progress: 60, isCompleted: false },
  });

  // Murid 2 (Dewi): Kursus 2 (Trigonometri) & Kursus 4 (Statistika)
  await prisma.enrollment.create({
    data: { userId: murid2.id, courseId: course2.id, progress: 100, isCompleted: true, completedAt: new Date() },
  });
  await prisma.enrollment.create({
    data: { userId: murid2.id, courseId: course4.id, progress: 50, isCompleted: false },
  });

  // Murid 3 (Reza): Kursus 1 & Kursus 5
  await prisma.enrollment.create({
    data: { userId: murid3.id, courseId: course1.id, progress: 40, isCompleted: false },
  });
  await prisma.enrollment.create({
    data: { userId: murid3.id, courseId: course5.id, progress: 30, isCompleted: false },
  });

  // Murid 4 (Anisa): Kursus 3 (Kalkulus 100% lulus) & Kursus 4 (Statistika)
  await prisma.enrollment.create({
    data: { userId: murid4.id, courseId: course3.id, progress: 100, isCompleted: true, completedAt: new Date() },
  });
  await prisma.enrollment.create({
    data: { userId: murid4.id, courseId: course4.id, progress: 80, isCompleted: false },
  });

  // Murid 5 (Fajar): Kursus 5 (Matriks 100% lulus) & Kursus 2
  await prisma.enrollment.create({
    data: { userId: murid5.id, courseId: course5.id, progress: 100, isCompleted: true, completedAt: new Date() },
  });
  await prisma.enrollment.create({
    data: { userId: murid5.id, courseId: course2.id, progress: 40, isCompleted: false },
  });

  console.log("✅ 10 Enrollment siswa berhasil dibuat");

  // ==========================================
  // HASIL KUIS SISWA & SERTIFIKAT KELULUSAN
  // Syarat: Skor >= 75% berhak dapat sertifikat!
  // ==========================================

  // Budi lulus Kuis 1 (Aljabar) dengan nilai 86.67% (13 dari 15 soal benar) -> Dapat Sertifikat!
  const cert1 = await prisma.certificate.create({
    data: {
      certificateCode: "EDUVIBE-BUDI-ALJABAR-2026",
      userId: murid1.id,
      courseId: course1.id,
      issuedAt: new Date("2026-11-12"),
    },
  });

  // Dewi lulus Kuis 2 (Trigonometri) dengan nilai 93.33% (14 dari 15 soal benar) -> Dapat Sertifikat!
  const cert2 = await prisma.certificate.create({
    data: {
      certificateCode: "EDUVIBE-DEWI-TRIGONO-2026",
      userId: murid2.id,
      courseId: course2.id,
      issuedAt: new Date("2026-11-14"),
    },
  });

  // Anisa lulus Kuis 3 (Kalkulus) dengan nilai 100% (15 dari 15 benar) -> Dapat Sertifikat!
  const cert3 = await prisma.certificate.create({
    data: {
      certificateCode: "EDUVIBE-ANISA-KALKULUS-2026",
      userId: murid4.id,
      courseId: course3.id,
      issuedAt: new Date("2026-11-15"),
    },
  });

  // Fajar lulus Kuis 5 (Matriks) dengan nilai 80% (12 dari 15 benar) -> Dapat Sertifikat!
  const cert4 = await prisma.certificate.create({
    data: {
      certificateCode: "EDUVIBE-FAJAR-MATRIKS-2026",
      userId: murid5.id,
      courseId: course5.id,
      issuedAt: new Date("2026-11-16"),
    },
  });

  // Buat Quiz Attempt untuk murid di atas
  // Helper ambil pertanyaan kuis
  async function simulateAttempt(userId, quizId, correctCount) {
    const qList = await prisma.question.findMany({
      where: { quizId },
      include: { options: true },
      orderBy: { order: "asc" },
    });

    const score = (correctCount / qList.length) * 100;
    const isPassed = score >= 75;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        isPassed,
        createdAt: new Date(),
        answers: {
          create: qList.map((q, idx) => {
            const shouldBeCorrect = idx < correctCount;
            const chosen = shouldBeCorrect
              ? q.options.find((o) => o.isCorrect)
              : q.options.find((o) => !o.isCorrect) || q.options[0];

            return {
              questionId: q.id,
              selectedOptionId: chosen.id,
            };
          }),
        },
      },
    });

    return attempt;
  }

  // Budi: Kuis 1 dapat 13 benar (86.7% - Lulus)
  await simulateAttempt(murid1.id, quiz1.id, 13);

  // Dewi: Kuis 2 dapat 14 benar (93.3% - Lulus)
  await simulateAttempt(murid2.id, quiz2.id, 14);

  // Reza: Kuis 1 dapat 8 benar (53.3% - Belum Lulus, < 75%)
  await simulateAttempt(murid3.id, quiz1.id, 8);

  // Anisa: Kuis 3 dapat 15 benar (100% - Lulus Sempurna)
  await simulateAttempt(murid4.id, quiz3.id, 15);

  // Fajar: Kuis 5 dapat 12 benar (80% - Lulus)
  await simulateAttempt(murid5.id, quiz5.id, 12);

  // Budi: Kuis 3 mencoba dapat 9 benar (60% - Belum Lulus)
  await simulateAttempt(murid1.id, quiz3.id, 9);

  console.log("✅ 6 Percobaan Kuis & 4 Sertifikat Kelulusan resmi berhasil dibuat");

  // Review dari Siswa
  await prisma.review.createMany({
    data: [
      { userId: murid1.id, courseId: course1.id, rating: 5, comment: "Penjelasan rumus abc dan pembuktian sifat logaritma sangat runut dan mudah dimengerti." },
      { userId: murid2.id, courseId: course2.id, rating: 5, comment: "Materi sudut istimewa dan aturan sinus-cosinus sangat membantu nilai ulangan matematika saya di sekolah!" },
      { userId: murid4.id, courseId: course3.id, rating: 5, comment: "Kalkulus SMA jadi jauh lebih logis tanpa harus sekadar menghafal rumus. Kuis 15 soalnya sangat menantang!" },
      { userId: murid5.id, courseId: course5.id, rating: 5, comment: "Sangat suka dengan ringkasan matriks dan transformasi geometri. Praktis dipelajari kapan saja." },
      { userId: murid3.id, courseId: course1.id, rating: 5, comment: "Platformnya interaktif dan cepat. Saya akan ulangi belajarnya agar lulus kuis berikutnya!" },
    ],
  });

  console.log("✅ 5 Ulasan kursus berhasil ditambahkan");

  console.log("\n🎉 ========================================================");
  console.log("🎉 SEEDING EDUVIBE (MATEMATIKA SMA) SELESAI DENGAN SUKSES!");
  console.log("==========================================================");
  console.log("\n🔑 Kredensial Akun Pengujian:");
  console.log("   👑 ADMIN     : admin@eduvibe.id / admin123");
  console.log("   👨‍🏫 GURU 1    : pengajar@eduvibe.id / pengajar123 (Drs. Bambang Sudiro, M.Pd)");
  console.log("   👩‍🏫 GURU 2    : pengajar2@eduvibe.id / pengajar123 (Nurul Aini, M.Mat)");
  console.log("   👨‍🎓 SISWA 1   : murid@eduvibe.id / murid123 (Budi Santoso - Lulus Aljabar)");
  console.log("   👩‍🎓 SISWA 2   : murid2@eduvibe.id / murid123 (Dewi Anggraini - Lulus Geometri)");
  console.log("   👨‍🎓 SISWA 3   : murid3@eduvibe.id / murid123 (Reza Fahlevi)");
  console.log("   👩‍🎓 SISWA 4   : murid4@eduvibe.id / murid123 (Anisa Rahma - Lulus Kalkulus 100%)");
  console.log("   👨‍🎓 SISWA 5   : murid5@eduvibe.id / murid123 (Fajar Nugroho - Lulus Matriks)");
  console.log("\n📚 Statistik Data:");
  console.log("   - 5 Kursus Matematika SMA Lengkap");
  console.log("   - 5 Modul Kuis (15 Soal Pilihan Ganda Tiap Kuis = Total 75 Soal)");
  console.log("   - Passing Grade Minimal: 75% untuk Terbit Sertifikat");
  console.log("   - 10 Data Pendaftaran (Enrollment)");
  console.log("   - 4 Sertifikat Kelulusan Resmi Digital");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
