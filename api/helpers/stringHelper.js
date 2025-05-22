/**
 * Türkçe karakterleri İngilizce karakterlere çeviren fonksiyon
 * @param {string} text - Dönüştürülecek metin
 * @returns {string} - Dönüştürülmüş metin
 */
const convertTurkishToEnglish = (text) => {
    const turkishChars = {
        'ı': 'i', 'İ': 'I',
        'ğ': 'g', 'Ğ': 'G',
        'ü': 'u', 'Ü': 'U',
        'ş': 's', 'Ş': 'S',
        'ö': 'o', 'Ö': 'O',
        'ç': 'c', 'Ç': 'C'
    };

    return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, (char) => turkishChars[char] || char);
};

module.exports = {
    convertTurkishToEnglish
}; 