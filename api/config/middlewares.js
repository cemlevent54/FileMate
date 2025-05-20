/**
 * Middleware yapılandırma dosyası
 * Bu dosya, uygulamanın tüm middleware'lerini yapılandırır.
 * 
 * Kullanım:
 * 1. Yeni bir middleware eklemek için configureMiddlewares fonksiyonu içine ekleyin
 * 2. Middleware'ler sıralı çalışır, sıralamaya dikkat edin
 * 3. Özel middleware'ler için ayrı bir dosya oluşturup buradan import edebilirsiniz
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const { PORT } = require('./constants');

/**
 * Swagger API dokümantasyonu yapılandırması
 * OpenAPI 3.0.0 spesifikasyonunu kullanır
 * Tüm API endpoint'leri için otomatik dokümantasyon oluşturur
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FileMate API',
            version: '1.0.0',
            description: 'FileMate API dokümantasyonu',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Geliştirme sunucusu',
            },
        ],
    },
    // Controller dosyalarındaki JSDoc yorumlarını tarar
    apis: [path.join(__dirname, '../controllers/*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * Middleware yapılandırma fonksiyonu
 * @param {Express} app - Express uygulama instance'ı
 * 
 * Kullanım:
 * 1. Temel middleware'ler (express.json, express.urlencoded) her zaman en başta olmalı
 * 2. Swagger UI middleware'i API dokümantasyonu için kullanılır
 * 3. Yeni middleware'ler eklerken sıralamaya dikkat edin
 */
const configureMiddlewares = (app) => {
    // Temel middleware'ler - Request body parsing için
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Swagger UI middleware - API dokümantasyonu için
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = configureMiddlewares; 