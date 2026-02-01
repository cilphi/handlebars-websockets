import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import {basePath} from './src/utils/utils.js';
import viewsRouter from './src/routes/views.router.js';
import productsRouter from './src/routes/products.router.js';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer);
const PORT = 8080;

/* Middleware para parsear JSON */
app.use(express.json());

/* Middleware para parsear datos de formularios */
app.use(express.urlencoded({ extended: true }));

/* Handlebars*/
app.use(express.static(basePath + '/public'))
app.use(express.static(basePath + '/src/managers'))
app.engine('handlebars', handlebars.engine({
    partialsDir: (basePath + '/src/views/partials')
}));
app.set('views', basePath + '/src/views');
app.set('view engine', 'handlebars');

/*Rutas */
app.use('/api/products', viewsRouter);
app.use('/realtimeproducts', productsRouter);

/* Sockets */
io.on('connection', socket => {
    console.log('Cliente conectado:', socket.id);
});

//Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor Express en puerto ${PORT}`);
});