import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Citizen } from '../types';

/**
 * Formats a date into Indonesian locale style: e.g. "9 Juli 2026"
 */
const formatIndonesianDate = (date: Date): string => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Gets the textual Green Level category based on points
 */
const getCategoryName = (points: number): string => {
  if (points >= 700) return 'Lestari Bintang (Gold)';
  if (points >= 450) return 'Pahlawan Hijau (Silver)';
  if (points >= 250) return 'Pejuang Eco (Bronze)';
  return 'Pemula Lestari (Basic)';
};

/**
 * Generates and downloads a clean, professional PDF report of citizens' points
 */
export const exportRecapToPDF = (citizens: Citizen[], selectedBlock: string) => {
  // Filter citizens based on block
  let filtered = [...citizens];
  if (selectedBlock !== 'semua') {
    filtered = filtered.filter(c => c.block === selectedBlock);
  }
  
  // Sort by points descending (Rank)
  filtered.sort((a, b) => b.points - a.points);

  // Initialize PDF (A4 size, Portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // 1. Draw Green Header Band Accent (Brand primary: #738E61)
  doc.setFillColor(115, 142, 97);
  doc.rect(0, 0, pageWidth, 12, 'F');

  // 2. Add Document Header Title
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LAPORAN BULANAN REKAPITULASI POIN HIJAU', 14, 25);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(115, 142, 97);
  doc.text('WARGA RT 005 / RW 013 • TAMAN BUARAN INDAH IV', 14, 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Sistem Informasi Tata Kelola Lingkungan Mandiri & Pemilahan Sampah Daur Ulang Lestari', 14, 35);

  // Divider Line
  doc.setDrawColor(210, 215, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 38, pageWidth - 14, 38);

  // 3. Document Metadata Information (Left side)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('INFORMASI LAPORAN', 14, 46);

  doc.setFont('helvetica', 'normal');
  doc.text('Wilayah Wilayah:', 14, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(selectedBlock === 'semua' ? 'Semua Blok (A, B, C, D)' : `Blok ${selectedBlock.toUpperCase()}`, 45, 52);

  doc.setFont('helvetica', 'normal');
  doc.text('Tanggal Cetak:', 14, 57);
  doc.setFont('helvetica', 'bold');
  doc.text(formatIndonesianDate(new Date()), 45, 57);

  doc.setFont('helvetica', 'normal');
  doc.text('Status Laporan:', 14, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(115, 142, 97);
  doc.text('REKAP RESMI BULANAN', 45, 62);

  // 4. Statistics Summary Card (Right side)
  const totalWeight = filtered.reduce((acc, c) => acc + c.weight, 0);
  const totalPoints = filtered.reduce((acc, c) => acc + c.points, 0);
  const totalHouses = filtered.length;

  doc.setDrawColor(220, 225, 210);
  doc.setFillColor(245, 247, 242);
  doc.roundedRect(125, 42, 71, 23, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 110, 90);
  doc.text('RINGKASAN REKAPITULASI', 129, 47);

  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Rumah:', 129, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(`${totalHouses} Rumah`, 165, 52);

  doc.setFont('helvetica', 'normal');
  doc.text('Total Sampah:', 129, 57);
  doc.setFont('helvetica', 'bold');
  doc.text(`${totalWeight.toFixed(1)} Kg`, 165, 57);

  doc.setFont('helvetica', 'normal');
  doc.text('Total Poin Hijau:', 129, 62);
  doc.setFont('helvetica', 'bold');
  doc.text(`${totalPoints.toLocaleString('id-ID')} Pts`, 165, 62);

  // Divider before table
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 70, pageWidth - 14, 70);

  // 5. Build Citizens Table using jspdf-autotable
  const tableData = filtered.map((citizen, index) => {
    // Determine overall Rank if filtering, or just use list index
    const overallIndex = citizens.findIndex(c => c.id === citizen.id);
    const displayRank = overallIndex !== -1 ? overallIndex + 1 : index + 1;

    return [
      displayRank.toString(),
      `Blok ${citizen.block} No. ${citizen.houseNo}`,
      citizen.name,
      `${citizen.weight.toFixed(1)} Kg`,
      `${citizen.points.toLocaleString('id-ID')} Pts`,
      getCategoryName(citizen.points)
    ];
  });

  autoTable(doc, {
    startY: 74,
    head: [['Peringkat', 'No. Rumah / Alamat', 'Nama Penghuni', 'Total Terpilah (Kg)', 'Akumulasi Poin', 'Kategori Level']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [115, 142, 97], // Brand primary green
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50],
      font: 'helvetica'
    },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center' }, // Rank
      1: { cellWidth: 40 },                    // House No
      2: { cellWidth: 42 },                    // Resident Name
      3: { cellWidth: 32, halign: 'center' }, // Weight
      4: { cellWidth: 28, halign: 'right' },  // Points
      5: { cellWidth: 32 }                    // Level
    },
    alternateRowStyles: {
      fillColor: [247, 249, 245]
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Simple Page Number Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Halaman ${data.pageNumber} dari ${doc.internal.pages.length - 1}`,
        pageWidth - 30,
        pageHeight - 10
      );
      doc.text(
        'Sistem Elektronik Pemilahan Sampah Lestari (E-PILAH) RT 005',
        14,
        pageHeight - 10
      );
    }
  });

  // 6. Signatures (Ditempatkan di bagian bawah setelah tabel selesai)
  // Gunakan startY dari autotable sebelumnya untuk menaruh tanda tangan di posisi yang aman
  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Jika tidak cukup ruang untuk tanda tangan di halaman yang sama, buat halaman baru
  if (finalY + 35 > pageHeight) {
    doc.addPage();
    finalY = 25;
  }

  doc.setDrawColor(220, 225, 210);
  doc.setLineWidth(0.3);
  doc.line(14, finalY, pageWidth - 14, finalY);

  const sigY = finalY + 12;
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);

  // Left Signee (Koordinator Green)
  doc.setFont('helvetica', 'normal');
  doc.text('Mengetahui,', 25, sigY);
  doc.text('Koordinator Program Green RT 005', 25, sigY + 4);
  doc.line(25, sigY + 22, 75, sigY + 22); // line for signature
  doc.setFont('helvetica', 'bold');
  doc.text('Kurniawan Santoso', 25, sigY + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. GRN-005-012', 25, sigY + 30);

  // Right Signee (Ketua RT 005)
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Disetujui Oleh,', pageWidth - 75, sigY);
  doc.text('Ketua Rukun Tetangga 005', pageWidth - 75, sigY + 4);
  doc.line(pageWidth - 75, sigY + 22, pageWidth - 25, sigY + 22); // line for signature
  doc.setFont('helvetica', 'bold');
  doc.text('H. Bambang Triyono', pageWidth - 75, sigY + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('RT.005 / RW.013', pageWidth - 75, sigY + 30);

  // Save the PDF locally
  const sanitizedBlock = selectedBlock === 'semua' ? 'Semua_Blok' : `Blok_${selectedBlock.toUpperCase()}`;
  doc.save(`Laporan_Poin_Hijau_RT005_${sanitizedBlock}_${new Date().toISOString().split('T')[0]}.pdf`);
};
