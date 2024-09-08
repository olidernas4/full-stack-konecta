const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors'); 
const swaggerSetup = require('./swagger'); // Import Swagger setup

const app = express();
const port = 3000;

// sha256 = require('js-sha256');  //imporyante

app.use(bodyParser.json());
app.use(cors()); // Usar cors

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'empleado',
  password: 'esuvejes1',
  port: 5432,
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.error('Authorization header missing');
    return res.status(403).json({ error: 'Token is required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing in authorization header');
    return res.status(403).json({ error: 'Token is required' });
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(500).json({ error: 'Invalid Token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
app.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO Usuarios (NOMBRE, EMAIL, PASSWORD, ROL) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Usuarios WHERE EMAIL = $1', [email]);
    if (result.rows.length === 0) {
      console.error('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const validPassword = password === user.password;
    if (!validPassword) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, role: user.rol }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token, role: user.rol });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Get all employees
 *     tags: [Empleado]
 *     responses:
 *       200:
 *         description: List of employees
 *       500:
 *         description: Server error
 */
app.get('/empleados', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Empleado');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Create a new employee
 *     tags: [Empleado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: integer
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *               salario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
app.post('/empleados', verifyToken, async (req, res) => {
  // Verifica que el rol del usuario sea 'Administrador'
  if (req.userRole !== 'Administrador') {
    console.error('Access denied for user:', req.userId);
    return res.status(403).json({ error: 'Access denied' });
  }

  // Extrae los datos del cuerpo de la solicitud
  const { nombre, tipo, fecha_ingreso, salario } = req.body;

  try {
    // Realiza la consulta para insertar un nuevo empleado
    const result = await pool.query(
      'INSERT INTO Empleado (NOMBRE, TIPO, FECHA_INGRESO, SALARIO) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, tipo, fecha_ingreso, salario]
    );

    // Devuelve el resultado de la inserción
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Maneja cualquier error que ocurra durante la inserción
    console.error('Error creating employee:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Get all requests
 *     tags: [Solicitud]
 *     responses:
 *       200:
 *         description: List of requests
 *       500:
 *         description: Server error
 */
app.get('/solicitudes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Solicitud');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Create a new request
 *     tags: [Solicitud]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               resumen:
 *                 type: string
 *               id_empleado:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Request created successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
app.post('/solicitudes', verifyToken, async (req, res) => {
  if (req.userRole !== 'Administrador') {
    console.error('Access denied for user:', req.userId);
    return res.status(403).json({ error: 'Access denied' });
  }
  const { nombre, descripcion, resumen, id_empleado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Solicitud (NOMBRE, DESCRIPCION, RESUMEN, ID_EMPLEADO) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, resumen, id_empleado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /solicitudes/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags: [Solicitud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The request ID
 *     responses:
 *       204:
 *         description: Request deleted successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
app.delete('/solicitudes/:id', verifyToken, async (req, res) => {
  if (req.userRole !== 'Administrador') {
    console.error('Access denied for user:', req.userId);
    return res.status(403).json({ error: 'Access denied' });
  }
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Solicitud WHERE ID = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: err.message });
  }
});

// Integrate Swagger
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});