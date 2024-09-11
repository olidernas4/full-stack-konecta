# full-stack-konecta
backend postgresql , creacion api con node js, frontend react para consumir api
Acceder a la Aplicación:

Frontend: http://localhost
Backend (API): http://localhost:3000/api-docs (documentación Swagger)

Proyecto de Gestión de Empleados y Solicitudes
Este proyecto incluye una aplicación completa para gestionar empleados y solicitudes, con funcionalidades de autenticación, autorización y una interfaz de usuario optimizada. A continuación, se describe cómo está estructurado el proyecto.

Funcionalidades
Autenticación y Autorización
Registro e Inicio de Sesión: Los usuarios pueden registrarse y autenticarse en el sistema.
JWT para Manejo de Sesiones: Utilizamos JSON Web Tokens (JWT) para manejar las sesiones de los usuarios de manera segura.
Roles de Usuario:
Empleado: Puede consultar información.
Administrador: Puede consultar, insertar y eliminar información.
Operaciones CRUD
Empleados:

Consulta: Los empleados pueden ver la información de los empleados existentes.
Inserción: Los administradores pueden agregar nuevos empleados.
Solicitudes:

Consulta: Los usuarios pueden ver las solicitudes.
Inserción: Los administradores pueden agregar nuevas solicitudes.
Eliminación: Solo los administradores pueden eliminar solicitudes.
Seguridad
Prevención de SQL Injection y XSS: Utilizamos consultas parametrizadas y saneamos las entradas para evitar inyecciones SQL y ataques XSS.
Optimizaciones
Paginación y Filtrado: Implementamos paginación para manejar grandes volúmenes de datos y filtrado para facilitar la búsqueda de información específica.
Frontend
Interfaz de Usuario
Vistas CRUD: Implementamos vistas que permiten realizar las operaciones CRUD mencionadas anteriormente.
Autenticación y Visualización Diferenciada: La interfaz se ajusta según el rol del usuario (Empleado o Administrador) para mostrar opciones y funcionalidades adecuadas.
Estado y Rendimiento
Context API: Utilizamos Context API para el manejo del estado global de la aplicación.
