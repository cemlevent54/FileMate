/**
 * Ana uygulama yapılandırma dosyası
 * Bu dosya, Express uygulamasını oluşturur ve tüm yapılandırmaları bir araya getirir.
 * 
 * Kullanım:
 * 1. Yeni bir yapılandırma eklemek için ilgili config dosyasını import edin
 * 2. Yapılandırmaları sıralı bir şekilde uygulayın
 * 3. Middleware'ler, endpoint'ler ve route'lar sırasıyla yapılandırılır
 */

const express = require('express');
const configureMiddlewares = require('./config/middlewares');
const configureEndpoints = require('./config/endpoints');
const configureRoutes = require('./config/routes');

// Express uygulamasını oluştur
const app = express();

// Yapılandırmaları sıralı bir şekilde uygula
// 1. Önce middleware'ler
configureMiddlewares(app);
// 2. Sonra endpoint'ler
configureEndpoints(app);
// 3. En son route'lar
configureRoutes(app);

module.exports = app; 