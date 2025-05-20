/**
 * Endpoint yapılandırma dosyası
 * Bu dosya, uygulamanın ana endpoint'lerini tanımlar.
 * 
 * Kullanım:
 * 1. Yeni bir endpoint eklemek için configureEndpoints fonksiyonu içine ekleyin
 * 2. Her endpoint için Swagger dokümantasyonu ekleyin
 * 3. Karmaşık endpoint'ler için ayrı controller'lar oluşturun
 */

/**
 * Ana sayfa endpoint'i için Swagger dokümantasyonu
 * @swagger
 * /:
 *   get:
 *     summary: Ana sayfa
 *     description: API'nin çalışıp çalışmadığını kontrol etmek için
 *     responses:
 *       200:
 *         description: Başarılı yanıt
 */

/**
 * Endpoint yapılandırma fonksiyonu
 * @param {Express} app - Express uygulama instance'ı
 * 
 * Kullanım:
 * 1. Basit endpoint'ler doğrudan burada tanımlanabilir
 * 2. Karmaşık işlemler için controller'lar kullanın
 * 3. Her endpoint için uygun HTTP metodunu kullanın (GET, POST, PUT, DELETE)
 */
const configureEndpoints = (app) => {
    // Ana sayfa endpoint'i - API sağlık kontrolü için
    app.get('/', (req, res) => {
        res.json({ message: 'API çalışıyor!' });
    });
};

module.exports = configureEndpoints; 