
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Dashboard.css'; 

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
            console.log('Adding empleado with token:', auth);
            const response = await fetch('http://localhost:3000/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`,
                },
                body: JSON.stringify({ nombre, tipo, fecha_ingreso: fechaIngreso, salario }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            const newEmpleado = await response.json();
            setEmpleados([...empleados, newEmpleado]);
        } catch (error) {
            console.error('Error adding empleado', error);
        }
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
            setSolicitudes([...solicitudes, newSolicitud]);
        } catch (error) {
            console.error('Error adding solicitud', error);
        }
    };

    return (
        <div className="dashboard">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="table-container">
                <h3>Empleados</h3>
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
                        {empleados.map((empleado) => (
                            <tr key={empleado.id}>
                                <td>{empleado.nombre}</td>
                                <td>{empleado.fecha_ingreso}</td>
                                <td>{empleado.salario}</td>
                                {role === 'Administrador' && (
                                    <td>
                                        <button>Editar</button>
                                        <button>Eliminar</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {role === 'Administrador' && (
                    <>
                        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <input type="text" placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                        <input type="date" placeholder="Fecha Ingreso" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
                        <input type="number" placeholder="Salario" value={salario} onChange={(e) => setSalario(e.target.value)} />
                        <button onClick={handleAddEmpleado}>Add Empleado</button>
                    </>
                )}
            </div>
            <div className="table-container">
                <h3>Solicitudes</h3>
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
                        {solicitudes.map((solicitud) => (
                            <tr key={solicitud.id}>
                                <td>{solicitud.nombre}</td>
                                <td>{solicitud.descripcion}</td>
                                <td>{solicitud.resumen}</td>
                                {role === 'Administrador' && (
                                    <td>
                                        <button>Editar</button>
                                        <button onClick={() => handleDeleteSolicitud(solicitud.id)}>Eliminar</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {role === 'Administrador' && (
                    <>
                        <input type="text" placeholder="Nombre de Solicitud" value={solicitudNombre} onChange={(e) => setSolicitudNombre(e.target.value)} />
                        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        <input type="text" placeholder="Resumen" value={resumen} onChange={(e) => setResumen(e.target.value)} />
                        <button onClick={handleAddSolicitud}>Add Solicitud</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;


;