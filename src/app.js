import express from 'express';
import routes from './routes';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    // Onde será cadastrado todos os middlewares da aplicação.
    middlewares() {
        this.server.use(express.json());
    }

    // Rotas estão implementadas em routes.js
    routes() {
        this.server.use(routes);
    }
}

// Exporta uma nova instância de app
export default new App().server;
