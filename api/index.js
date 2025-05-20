const app = require('./app');
const { PORT } = require('./config/constants');

app.listen(PORT, 
    () => {
        console.log(`Server is running on link http://localhost:${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    }
);

