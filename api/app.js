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
const configureCors = require('./config/cors');
const configureMiddlewares = require('./config/middlewares');
const configureEndpoints = require('./config/endpoints');
const configureRoutes = require('./config/routes');
const path = require('path');

// Express uygulamasını oluştur
const app = express();

// Yapılandırmaları sıralı bir şekilde uygula

configureCors(app);

configureMiddlewares(app);

configureEndpoints(app);

configureRoutes(app);

// Statik dosya servisi
app.use('/storage', express.static(path.join(__dirname, 'storage')));

module.exports = app; 