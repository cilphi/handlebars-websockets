# Servidor

Con este servidor puedes:

- Obtener una lista de los productos
- Agregar un productos
- Actualizar los datos de un producto de la lista
- Borrar uno o todos los productos de la lista y luego crear el archivo de lista inicial otra vez

Se visualiza desde el puerto 8080, si quieres cambiar la salida, debes ir al archivo **app.js** y en la constante **PORT** escribir tu número de puerto deseado.

- Framework: Express
- Plataforma: Node.js
- API: Socket.io
- Lenguaje: JavaScript, Handlebars, CSS

## Iniciar el servidor

### Abrir una nueva terminal

Escribe el comando de inicio:
- Consola: 
```bash
node app.js
```
### Ingresar al Home

Escribe la siguiente URL:
- Barra de direcciones: 
```bash
http://localhost:8080/api/products
```
## Crear la lista

### Write File

Para crear la lista de productos:
- Botón: 
```bash
Restaurar Lista de Productos
```
## Método GET

### Get Products

Para ver la lista de productos:
- Navbar: 
```
Lista de Productos
```
- URL: 
```
http://localhost:8080/api/products
```
### Get Real Time Products

Para ver la lista de productos manipulada en tiempo real con Socket.io:
- Navbar: 
```
Websocket
```
- URL: 
```
http://localhost:8080/realtimeproducts
```

## Método POST

### Crear Producto

Para añadir un producto: 
- Formulario Agregar producto:
```bash 
Botón Crear Producto
```

## Método PUT

Para actualizar un producto: 
- Formulario Actualizar producto:
```bash 
Botón Actualizar Producto
```
## Método DELETE

Para eliminar un producto:
- Ir al card del producto que se desea eliminar:
```bash
Botón Eliminar Producto
```

