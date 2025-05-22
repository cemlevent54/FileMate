const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Klasörlerin varlığını kontrol et, yoksa oluştur
const imageDir = path.join(__dirname, '../storage/images');
const fileDir = path.join(__dirname, '../storage/files');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      cb(null, imageDir);
    } else if (ext === ".pdf") {
      cb(null, fileDir);
    } else {
      cb(new Error('Desteklenmeyen dosya formatı'), null);
    }
  },
  filename: function (req, file, cb) {
    // Orijinal dosya adını ve uzantısını koru
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

module.exports = upload; 