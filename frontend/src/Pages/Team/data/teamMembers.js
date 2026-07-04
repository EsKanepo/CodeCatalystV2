import anggara from "../../../Assets/anggara.jpg";
import ethan from "../../../Assets/ethan.jpg";
import devin from "../../../Assets/devin.jpg";

const teamMembers = [
  {
    name: "Anggara Adelee",
    nim: "241112271",
    img: anggara,
    role: "Home, About Catalyst, Tim Pengembang, Umpan Balik",
    email: "anggara.adelee@students.mikroskil.ac.id",
    desc:
      "Bertanggung jawab atas pengembangan halaman utama dan About Catalyst serta koordinasi tim dan umpan balik pengguna.",
    contributions: [
      "Desain Home Page",
      "Halaman About Catalyst",
      "Koordinasi tim",
      "Manajemen feedback",
    ],
    tools: ["React", "JavaScript", "CSS"],
  },
  {
    name: "Ethan Wilbert",
    nim: "241110939",
    img: ethan,
    role: "Daftar Kursus, Detail Kursus, Referensi, FAQ",
    email: "ethan.wilbert@students.mikroskil.ac.id",
    desc:
      "Mengelola struktur kursus, halaman detail, dan FAQ agar navigasi mudah dan informatif.",
    contributions: [
      "Manajemen data kursus",
      "Halaman detail kursus",
      "FAQ interaktif",
    ],
    tools: ["React", "JavaScript"],
  },
  {
    name: "Devin Owen Sanusi",
    nim: "241111093",
    img: devin,
    role: "Pendaftaran, Konfirmasi, Desain, Efek Visual",
    email: "devin.owen@students.mikroskil.ac.id",
    desc:
      "Menangani pendaftaran pengguna dan efek visual untuk meningkatkan pengalaman pengguna.",
    contributions: [
      "Form pendaftaran",
      "Konfirmasi user",
      "Efek animasi UI",
    ],
    tools: ["React", "CSS"],
  },
  {
    name: "Nicholian Tjuarsa",
    nim: "241110066",
    img: devin,
    role: "Schedule , Profil Pengajar , Testimoni",
    email: "nicholian.tjuarsa@students.mikroskil.ac.id",
    desc:
      "Mengelola jadwal, profil pengajar, dan testimoni untuk memastikan responsivitas tampilan.",
    contributions: [
      "Halaman jadwal",
      "Profil pengajar",
      "Testimoni pengguna",
    ],
    tools: ["React", "Bootstrap"],
  },
];

export default teamMembers;
