# Electronic-Components-Store

Un sitio web para la venta de productos electrónicos. Desarrollado utilizando Node.hs y Express, y utilicé MongoDB como base de datos. Además, el sitio cuenta con una sección dedicada al armado de computadoras, que incluye validaciones de compatibilidad entre los componentes, lo que ayuda a los clientes a seleccionar los productos adecuados para sus necesidades específicas.


### Requisitos previos
Antes de ejecutar este proyecto, asegúrate de tener instalados los siguientes requisitos previos:

Node.js (versión 10 o superior)
MongoDB (versión 4.0 o superior)

### Instalación
Para instalar este proyecto, sigue estos pasos:

Clona este repositorio en tu computadora:
```
git clone https://github.com/EmuSTTM/Electronic-Components-Store.git
```
Ingresa a la carpeta del proyecto: cd Electronic-Components-Store
Instala las dependencias del proyecto: 
```
npm install
```

### Configuración de la base de datos
Este proyecto utiliza una base de datos MongoDB por defecto. Asegúrate de tener instalado y ejecutando MongoDB en tu máquina local. Si deseas cambiar la conexión a la base de datos, modifica la variable MONGODB_URI en el archivo app.js .

### Ejecución
Para ejecutar la aplicación, utiliza el siguiente comando:
```
npm run dev
```
Esto iniciará el servidor de desarrollo en el puerto predeterminado (3000). Si deseas utilizar otro puerto, modifica la variable PORT en el archivo bin/www .

### Uso
Esta aplicación es un e-commerce ficticio, por lo que permite agregar al carrito productos, crearlos, actualizarlos, eliminarlos y visualizarlos. Posee
a su vez un sistema de usuarios, donde se limitan y añaden funciones dependiendo del rol. Si desea tener acceso a todas las funcionalidades de la página,
cree un usuario con el rol de "vendedor" en /users/signup. Esto le permitirá crear todos los productos, actualizarlos y borrarlos.
