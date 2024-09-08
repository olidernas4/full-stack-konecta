import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Dashboard.css'; 
import Navbar from '../Nav'; 

const Dashboard = () => {
    const { auth, role } = useContext(AuthContext);
    const [empleados, setEmpleados] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [salario, setSalario] = useState('');
    const [solicitudNombre, setSolicitudNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [resumen, setResumen] = useState('');
    const [editEmpleadoId, setEditEmpleadoId] = useState(null);
    const [editEmpleadoData, setEditEmpleadoData] = useState({});
    const [editSolicitudId, setEditSolicitudId] = useState(null);
    const [editSolicitudData, setEditSolicitudData] = useState({});
    const { setAuth, setRole } = useContext(AuthContext);
    
    const handleLogout = () => {
        setAuth(null);
        setRole(null);
    };

    // Estado para el filtro y paginación
    const [filterEmpleado, setFilterEmpleado] = useState('');
    const [filterSolicitud, setFilterSolicitud] = useState(''); // Estado para el filtro de solicitudes
    const [currentPageEmpleados, setCurrentPageEmpleados] = useState(1);
    const [currentPageSolicitudes, setCurrentPageSolicitudes] = useState(1);
    const empleadosPerPage = 5;
    const solicitudesPerPage = 5;

    // Filtrar empleados
    const filteredEmpleados = empleados.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(filterEmpleado.toLowerCase())
    );

    // Filtrar solicitudes
    const filteredSolicitudes = solicitudes.filter((solicitud) =>
        solicitud.nombre.toLowerCase().includes(filterSolicitud.toLowerCase()) ||
        solicitud.descripcion.toLowerCase().includes(filterSolicitud.toLowerCase()) ||
        solicitud.resumen.toLowerCase().includes(filterSolicitud.toLowerCase())
    );

    // Calcular los empleados a mostrar por página
    const indexOfLastEmpleado = currentPageEmpleados * empleadosPerPage;
    const indexOfFirstEmpleado = indexOfLastEmpleado - empleadosPerPage;
    const currentEmpleados = filteredEmpleados.slice(indexOfFirstEmpleado, indexOfLastEmpleado);

    // Calcular las solicitudes a mostrar por página
    const indexOfLastSolicitud = currentPageSolicitudes * solicitudesPerPage;
    const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
    const currentSolicitudes = filteredSolicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);

    // Cambiar de página
    const paginateEmpleados = (pageNumber) => setCurrentPageEmpleados(pageNumber);
    const paginateSolicitudes = (pageNumber) => setCurrentPageSolicitudes(pageNumber);

    useEffect(() => {
        console.log('Role:', role); 
        const fetchData = async () => {
            try {
                console.log('Fetching with token:', auth);
                const empleadosResponse = await fetch('http://localhost:3000/empleados', {
                    headers: { Authorization: `Bearer ${auth}` },
                });
                if (!empleadosResponse.ok) {
                    const errorData = await empleadosResponse.json();
                    throw new Error(errorData.error);
                }
                const empleadosData = await empleadosResponse.json();
                setEmpleados(empleadosData);

                console.log('Fetching solicitudes with token:', auth);
                const solicitudesResponse = await fetch('http://localhost:3000/solicitudes', {
                    headers: { Authorization: `Bearer ${auth}` },
                });
                if (!solicitudesResponse.ok) {
                    const errorData = await solicitudesResponse.json();
                    throw new Error(errorData.error);
                }
                const solicitudesData = await solicitudesResponse.json();
                setSolicitudes(solicitudesData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        if (auth) {
            fetchData();
        }
    }, [auth, role]);

    const handleAddEmpleado = async () => {
        try {
            console.log('Adding empleado:', { nombre, tipo, fecha_ingreso: fechaIngreso, salario });
            const response = await fetch('http://localhost:3000/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify({ nombre, tipo, fecha_ingreso: fechaIngreso, salario }),
            });
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.error);
            }
            const newEmpleado = await response.json();
            console.log('New Empleado:', newEmpleado);
            setEmpleados([...empleados, newEmpleado]);
        } catch (error) {
            console.error('Error adding empleado', error);
        }
    };

    const handleDeleteEmpleado = async (id) => {
        try {
            console.log('Deleting empleado with token:', auth);
            const response = await fetch(`http://localhost:3000/empleados/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            setEmpleados(empleados.filter((empleado) => empleado.id !== id));
        } catch (error) {
            console.error('Error deleting empleado', error);
        }
    };

    const handleEditEmpleado = (id) => {
        const empleado = empleados.find((emp) => emp.id === id);
        setEditEmpleadoId(id);
        setEditEmpleadoData(empleado);
    };

    const handleSaveEmpleado = async (id) => {
        try {
            console.log('Saving empleado with token:', auth);
            const response = await fetch(`http://localhost:3000/empleados/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify(editEmpleadoData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const updatedEmpleado = await response.json();
            setEmpleados(empleados.map((emp) => (emp.id === id ? updatedEmpleado : emp)));
            setEditEmpleadoId(null);
            setEditEmpleadoData({});
        } catch (error) {
            console.error('Error saving empleado', error);
        }
    };

    const handleChangeEditEmpleado = (e) => {
        const { name, value } = e.target;
        setEditEmpleadoData({ ...editEmpleadoData, [name]: value });
    };

    const handleDeleteSolicitud = async (id) => {
        try {
            console.log('Deleting solicitud with token:', auth);
            const response = await fetch(`http://localhost:3000/solicitudes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
        } catch (error) {
            console.error('Error deleting solicitud', error);
        }
    };

    const handleEditSolicitud = (id) => {
        const solicitud = solicitudes.find((sol) => sol.id === id);
        setEditSolicitudId(id);
        setEditSolicitudData(solicitud);
    };

    const handleSaveSolicitud = async (id) => {
        try {
            console.log('Saving solicitud with token:', auth);
            const response = await fetch(`http://localhost:3000/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify(editSolicitudData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const updatedSolicitud = await response.json();
            setSolicitudes(solicitudes.map((sol) => (sol.id === id ? updatedSolicitud : sol)));
            setEditSolicitudId(null);
            setEditSolicitudData({});
        } catch (error) {
            console.error('Error saving solicitud', error);
        }
    };

    const handleChangeEditSolicitud = (e) => {
        const { name, value } = e.target;
        setEditSolicitudData({ ...editSolicitudData, [name]: value });
    };

    const handleAddSolicitud = async () => {
        try {
            console.log('Adding solicitud with token:', auth);
            const response = await fetch('http://localhost:3000/solicitudes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify({ nombre: solicitudNombre, descripcion, resumen }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const newSolicitud = await response.json();
            console.log('New Solicitud:', newSolicitud);
            setSolicitudes([...solicitudes, newSolicitud]);
        } catch (error) {
            console.error('Error adding solicitud', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar handleLogout={handleLogout} />

            {/* Empleados */}
            <div className="table-container">
                <h3>Empleados</h3>
                <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filterEmpleado}
                    onChange={(e) => setFilterEmpleado(e.target.value)}
                    className="filter-empleados"
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha de Ingreso</th>
                            <th>Salario</th>
                            {role === 'Administrador' && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmpleados.map((empleado) => (
                            <tr key={empleado.id}>
                                <td>
                                    {editEmpleadoId === empleado.id ? (
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={editEmpleadoData.nombre}
                                            onChange={handleChangeEditEmpleado}
                                        />
                                    ) : (
                                        empleado.nombre
                                    )}
                                </td>
                                <td>
                                    {editEmpleadoId === empleado.id ? (
                                        <input
                                            type="date"
                                            name="fecha_ingreso"
                                            value={editEmpleadoData.fecha_ingreso}
                                            onChange={handleChangeEditEmpleado}
                                        />
                                    ) : (
                                        empleado.fecha_ingreso
                                    )}
                                </td>
                                <td>
                                    {editEmpleadoId === empleado.id ? (
                                        <input
                                            type="number"
                                            name="salario"
                                            value={editEmpleadoData.salario}
                                            onChange={handleChangeEditEmpleado}
                                        />
                                    ) : (
                                        empleado.salario
                                    )}
                                </td>
                                {role === 'Administrador' && (
                                    <td>
                                        {editEmpleadoId === empleado.id ? (
                                            <button className="save-button" onClick={() => handleSaveEmpleado(empleado.id)}>Guardar</button>
                                        ) : (
                                            <>
                                                <button className="edit-button" onClick={() => handleEditEmpleado(empleado.id)}>Editar</button>
                                                <button className="delete-button" onClick={() => handleDeleteEmpleado(empleado.id)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Paginación para empleados */}
                <div className="pagination">
                    {[...Array(Math.ceil(filteredEmpleados.length / empleadosPerPage)).keys()].map(number => (
                        <button key={number + 1} onClick={() => paginateEmpleados(number + 1)}>{number + 1}</button>
                    ))}
                </div>
                {(role === 'Administrador') && (
                    <div className="admin-form-container">
                        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <input type="text" placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                        <input type="date" placeholder="Fecha Ingreso" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
                        <input type="number" placeholder="Salario" value={salario} onChange={(e) => setSalario(e.target.value)} />
                        <button onClick={handleAddEmpleado}>Add Empleado</button>
                    </div>
                )}
            </div>

            {/* Solicitudes */}
            <div className="table-container">
                <h3>Solicitudes</h3>
                
                {/* Campo para el filtro de solicitudes */}
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Filtrar solicitudes"
                        value={filterSolicitud}
                        onChange={(e) => setFilterSolicitud(e.target.value)}
                    />
                </div>

                
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Resumen</th>
                            {role === 'Administrador' && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentSolicitudes.map((solicitud) => (
                            <tr key={solicitud.id}>
                                <td>
                                    {editSolicitudId === solicitud.id ? (
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={editSolicitudData.nombre}
                                            onChange={handleChangeEditSolicitud}
                                        />
                                    ) : (
                                        solicitud.nombre
                                    )}
                                </td>
                                <td>
                                    {editSolicitudId === solicitud.id ? (
                                        <input
                                            type="text"
                                            name="descripcion"
                                            value={editSolicitudData.descripcion}
                                            onChange={handleChangeEditSolicitud}
                                        />
                                    ) : (
                                        solicitud.descripcion
                                    )}
                                </td>
                                <td>
                                    {editSolicitudId === solicitud.id ? (
                                        <input
                                            type="text"
                                            name="resumen"
                                            value={editSolicitudData.resumen}
                                            onChange={handleChangeEditSolicitud}
                                        />
                                    ) : (
                                        solicitud.resumen
                                    )}
                                </td>
                                {role === 'Administrador' && (
                                    <td>
                                        {editSolicitudId === solicitud.id ? (
                                            <button className="save-button" onClick={() => handleSaveSolicitud(solicitud.id)}>Guardar</button>
                                        ) : (
                                            <>
                                                <button className="edit-button" onClick={() => handleEditSolicitud(solicitud.id)}>Editar</button>
                                                <button className="delete-button" onClick={() => handleDeleteSolicitud(solicitud.id)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Paginación para solicitudes */}
                <div className="pagination">
                    {[...Array(Math.ceil(filteredSolicitudes.length / solicitudesPerPage)).keys()].map(number => (
                        <button key={number + 1} onClick={() => paginateSolicitudes(number + 1)}>{number + 1}</button>
                    ))}
                </div>
                {(role === 'Administrador') && (
                    <div className="admin-form-container">
                        <input type="text" placeholder="Nombre Solicitud" value={solicitudNombre} onChange={(e) => setSolicitudNombre(e.target.value)} />
                        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        <input type="text" placeholder="Resumen" value={resumen} onChange={(e) => setResumen(e.target.value)} />
                        <button onClick={handleAddSolicitud}>Add Solicitud</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;