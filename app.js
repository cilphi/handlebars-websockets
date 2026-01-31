import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './src/utils/utils.js';
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
app.engine('handlebars', handlebars.engine({
    partialsDir: (__dirname + '/src/views/partials')
}));
app.set('views', __dirname + '/src/views');
app.set('view engine', 'handlebars');

/*Rutas */
app.use('/api/products', viewsRouter);
app.use('/realtimeproducts', productsRouter);

/* Sockets */
io.on('connection', (socket) => {
    //socket.on('message', (data) => {}
    console.log('Nuevo cliente conectado');
});

//Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor Express en puerto ${PORT}`);
});