import { Citizen, WasteGuideItem, GameItem } from './types';

export const fallbackCitizens: Citizen[] = [
  { id: "LA1-1", block: "LA 1", houseNo: "1", name: "Fatrina Diani", points: 120, weight: 8.0, lastActive: "Kemarin" },
  { id: "LA1-2", block: "LA 1", houseNo: "2", name: "Muchlis Rida", points: 340, weight: 26.5, lastActive: "Hari ini" },
  { id: "LA1-3", block: "LA 1", houseNo: "3", name: "Gigih Tamara", points: 410, weight: 32.0, lastActive: "Hari ini" },
  { id: "LA1-4", block: "LA 1", houseNo: "4", name: "Edy Syawardi", points: 150, weight: 11.2, lastActive: "2 hari lalu" },
  { id: "LA1-5", block: "LA 1", houseNo: "5", name: "Yuswadi", points: 480, weight: 36.8, lastActive: "Hari ini" },
  { id: "LA1-6", block: "LA 1", houseNo: "6", name: "Baso Amir", points: 200, weight: 15.0, lastActive: "3 hari lalu" },
  { id: "LA1-7-8", block: "LA 1", houseNo: "7-8", name: "Benny Irawan", points: 650, weight: 51.2, lastActive: "Hari ini" },
  { id: "LA1-10", block: "LA 1", houseNo: "10", name: "Martin", points: 90, weight: 6.8, lastActive: "5 hari lalu" },
  { id: "LA1-11", block: "LA 1", houseNo: "11", name: "Faisal Badjeber", points: 280, weight: 21.0, lastActive: "Kemarin" },
  { id: "LA1-12", block: "LA 1", houseNo: "12", name: "M. Taufiq", points: 520, weight: 40.5, lastActive: "Hari ini" },
  { id: "LA1-13", block: "LA 1", houseNo: "13", name: "Sahlan Suharman", points: 160, weight: 12.0, lastActive: "4 hari lalu" },
  { id: "LA1-14", block: "LA 1", houseNo: "14", name: "Ambarak Attamimi", points: 390, weight: 29.5, lastActive: "Kemarin" },
  { id: "LA1-15", block: "LA 1", houseNo: "15", name: "Ibu Yuniarsih", points: 440, weight: 34.2, lastActive: "Hari ini" },
  { id: "LA1-16", block: "LA 1", houseNo: "16", name: "Tangkilisan Luntungan", points: 210, weight: 16.5, lastActive: "Kemarin" },
  { id: "LA1-17", block: "LA 1", houseNo: "17", name: "Yoga Anantio", points: 310, weight: 23.8, lastActive: "Hari ini" },
  { id: "LA1-18", block: "LA 1", houseNo: "18", name: "H. Amas Muda Dalimunthe", points: 470, weight: 35.6, lastActive: "Kemarin" },
  { id: "LA1-19", block: "LA 1", houseNo: "19", name: "David Stephanus", points: 590, weight: 46.2, lastActive: "Hari ini" },
  { id: "LA8-1", block: "LA 8", houseNo: "1", name: "Kharudin", points: 180, weight: 13.5, lastActive: "Kemarin" },
  { id: "LA8-3", block: "LA 8", houseNo: "3", name: "Ny Fuad", points: 320, weight: 24.8, lastActive: "Hari ini" },
  { id: "LA8-4", block: "LA 8", houseNo: "4", name: "Wahid", points: 240, weight: 18.2, lastActive: "3 hari lalu" },
  { id: "LC1-1", block: "LC 1", houseNo: "1", name: "Erick Chandra", points: 450, weight: 34.0, lastActive: "Hari ini" },
  { id: "LC1-1_alt", block: "LC 1", houseNo: "1", name: "Firmansyah Siregar", points: 510, weight: 39.5, lastActive: "Hari ini" },
  { id: "LC1-1-2", block: "LC 1", houseNo: "1-2", name: "Surharni Veronika", points: 710, weight: 56.4, lastActive: "Hari ini" },
  { id: "LC1-3", block: "LC 1", houseNo: "3", name: "Genthur", points: 300, weight: 22.5, lastActive: "Kemarin" },
  { id: "LC1-4", block: "LC 1", houseNo: "4", name: "Irdimansyah", points: 130, weight: 9.8, lastActive: "4 hari lalu" },
  { id: "LC1-5-6", block: "LC 1", houseNo: "5-6", name: "Supardi", points: 850, weight: 68.2, lastActive: "Hari ini" },
  { id: "LC1-7", block: "LC 1", houseNo: "7", name: "Mas Sus Subekti", points: 220, weight: 16.0, lastActive: "Kemarin" },
  { id: "LC1-8", block: "LC 1", houseNo: "8", name: "Martha", points: 370, weight: 28.0, lastActive: "Hari ini" },
  { id: "LC1-9", block: "LC 1", houseNo: "9", name: "Bima Bagus Baskoro", points: 540, weight: 41.5, lastActive: "Hari ini" }
];

export const wasteDb: WasteGuideItem[] = [
  { name: "botol air mineral", category: "anorganik", type: "Plastik PET", instruction: "Bilas sisa air, remas botol untuk menghemat ruang, lepas label plastik sebisanya." },
  { name: "kardus mie instan", category: "anorganik", type: "Kertas/Kardus", instruction: "Lipat hingga rata, pastikan kering dan ikat menggunakan tali rafia." },
  { name: "kulit pisang", category: "organik", type: "Organik Basah", instruction: "Masukkan ke lubang biopori atau tong komposter hijau di rumah." },
  { name: "sisa nasi", category: "organik", type: "Organik Basah", instruction: "Tiriskan airnya, sangat cocok dijadikan pupuk kompos atau pakan maggot." },
  { name: "baterai bekas", category: "b3", type: "Bahan Beracun", instruction: "Kumpulkan dalam wadah kering tertutup lalu serahkan ke pos RT untuk kotak B3 merah." },
  { name: "lampu neon rusak", category: "b3", type: "Bahan Beracun", instruction: "Bungkus kertas koran tebal agar jika pecah tidak melukai petugas pengambil." },
  { name: "popok bayi", category: "residu", type: "Residu", instruction: "Buang kotoran padat ke toilet terlebih dahulu, gulung popok rapat-rapat dan masukkan tempat sampah residu." },
  { name: "tisu bekas pakai", category: "residu", type: "Residu", instruction: "Tisu bekas berminyak atau terkena cairan tubuh tidak bisa didaur ulang. Langsung tempat sampah abu-abu/hitam." },
  { name: "botol beling", category: "anorganik", type: "Kaca", instruction: "Bilas bersih, pastikan tidak pecah saat dimasukkan ke dalam wadah pengumpul khusus kaca." },
  { name: "minyak goreng bekas", category: "anorganik", type: "Minyak Jelantah", instruction: "Tunggu dingin, saring ampasnya, masukkan jerigen/botol plastik tertutup. Berharga tinggi untuk biodiesel!" },
  { name: "kaleng susu", category: "anorganik", type: "Logam", instruction: "Bilas hingga bersih dari sisa cairan susu, jemur kering agar tidak karat, kumpulkan dengan anorganik." },
  { name: "daun kering", category: "organik", type: "Organik Kering", instruction: "Kumpulkan untuk kompos warga atau lapisi tanah tanaman hias sebagai mulsa alami." },
  { name: "kulit buah", category: "organik", type: "Organik Basah", instruction: "Potong kecil-kecil lalu masukkan ke eco-enzyme atau komposter komunal." }
];

export const gameItems: GameItem[] = [
  { icon: "🍎", name: "Sisa Buah Apel", type: "organik" },
  { icon: "📄", name: "Kertas Dokumen Bekas", type: "anorganik" },
  { icon: "🔋", name: "Baterai Jam Dinding", type: "b3" },
  { icon: "🧻", name: "Tisu Toilet Kotor", type: "residu" },
  { icon: "🦴", name: "Tulang Ayam Bekas Makan", type: "organik" },
  { icon: "🧴", name: "Botol Sampo Plastik", type: "anorganik" },
  { icon: "🪓", name: "Kaleng Semprotan Nyamuk", type: "b3" },
  { icon: "🥤", name: "Gelas Plastik Air Mineral", type: "anorganik" },
  { icon: "📦", name: "Kardus Paket", type: "anorganik" },
  { icon: "💡", name: "Bohlam Lampu Kamar", type: "b3" },
  { icon: "🩹", name: "Plester Luka Bekas", type: "residu" },
  { icon: "🥬", name: "Batang Sawi Sisa Dapur", type: "organik" }
];
