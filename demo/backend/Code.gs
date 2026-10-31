/**
 * Google Apps Script - Web App Backend untuk Peta Calon Pelanggan
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka Google Sheets baru: https://sheets.new
 * 2. Klik menu 'Ekstensi' > 'Apps Script'.
 * 3. Hapus kode default, lalu tempelkan kode di bawah ini.
 * 4. Klik tombol 'Deploy' (Terapkan) > 'New deployment' (Penerapan baru).
 * 5. Pilih jenis 'Web App' (Aplikasi Web).
 * 6. Setel:
 *    - Execute as: Me (Email Anda)
 *    - Who has access: Anyone (Siapa saja)  <-- PENTING!
 * 7. Klik 'Deploy', salin 'Web App URL' yang dihasilkan.
 * 8. Tempelkan URL tersebut ke file `js/config.js` pada baris `SCRIPT_URL`.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Buat header kolom otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "No",
        "Latitude",
        "Longitude",
        "Nama Lengkap",
        "Nomor KTP / NIK",
        "No. WhatsApp",
        "Alamat Lengkap",
        "Peruntukan Bangunan",
        "Klasifikasi Pelanggan"
      ]);
      // Format baris header agar tebal & rata tengah untuk kolom No
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
    }

    var p = e.parameter;
    // Beri tanda petik di depan koordinat agar Google Sheets tidak mengubah tanda titik desimal menjadi pemisah ribuan
    var lat = p.latitude ? "'" + p.latitude : "";
    var lng = p.longitude ? "'" + p.longitude : "";
    var nama = p.nama || "";
    var nik = p.nik ? "'" + p.nik : ""; // Beri tanda petik agar digit NIK tidak diubah jadi notasi ilmiah
    var whatsapp = p.whatsapp ? "'" + p.whatsapp : "";
    var alamat = p.alamat || "";
    var peruntukan = p.peruntukan_bangunan || "";
    var klasifikasi = p.klasifikasi_pelanggan || "";

    // Kolom No diisi rumus '=ROW()-1'
    // Rumus ini membuat nomor urut 1, 2, 3, dst secara dinamis.
    // Jika ada baris yang dihapus di kemudian hari, nomor urut baris di bawahnya otomatis bergeser menyesuaikan secara runtut!
    sheet.appendRow([
      "=ROW()-1",
      lat,
      lng,
      nama,
      nik,
      whatsapp,
      alamat,
      peruntukan,
      klasifikasi
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data pendaftaran berhasil disimpan ke sistem!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        total: 0,
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      // Ambil baris jika ada data (nama / koordinat / WA)
      if (r[3] || r[1] || r[5]) {
        var rawLat = r[1] !== undefined ? r[1].toString().replace(/^'/, "").trim().replace(',', '.') : "";
        var rawLng = r[2] !== undefined ? r[2].toString().replace(/^'/, "").trim().replace(',', '.') : "";

        // Normalisasi jika koordinat terlanjur tersimpan tanpa titik (misal -2973851 -> -2.973851)
        var numLat = parseFloat(rawLat);
        if (!isNaN(numLat) && !rawLat.includes('.') && Math.abs(numLat) > 1000) {
          rawLat = (numLat / 1000000).toFixed(6);
        }

        var numLng = parseFloat(rawLng);
        if (!isNaN(numLng) && !rawLng.includes('.') && Math.abs(numLng) > 1000) {
          rawLng = (numLng / 1000000).toFixed(6);
        }

        rows.push({
          no: i,
          latitude: rawLat,
          longitude: rawLng,
          nama: r[3] || "",
          nik: (r[4] || "").toString().replace(/^'/, ""),
          whatsapp: (r[5] || "").toString().replace(/^'/, ""),
          alamat: r[6] || "",
          peruntukan: r[7] || "",
          klasifikasi: r[8] || ""
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: rows.length,
      data: rows
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
