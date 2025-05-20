/**
 * Sabit değerler yapılandırma dosyası
 * Bu dosya, uygulamanın tüm sabit değerlerini içerir.
 * 
 * Kullanım:
 * 1. Yeni bir sabit değer eklemek için bu dosyaya ekleyin
 * 2. İleride .env dosyasına taşınacak değerler için açıklama ekleyin
 * 3. Tüm sabit değerleri buradan import edin
 */

// Sunucu yapılandırması
const PORT = 8030;

// API yapılandırması
const API_PREFIX = '/api';
const API_VERSION = 'v1';

module.exports = {
    PORT,
    API_PREFIX,
    API_VERSION
}; 