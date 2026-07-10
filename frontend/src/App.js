import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// ========== SIMULADOR DE BASE DE DATOS LOCAL ==========
const DB_KEY = 'sucursales_db';

// Leer datos del localStorage
const leerDB = () => {
  const datos = localStorage.getItem(DB_KEY);
  return datos ? JSON.parse(datos) : [];
};

// Guardar datos en localStorage
const guardarDB = (sucursales) => {
  localStorage.setItem(DB_KEY, JSON.stringify(sucursales));
};

// Generar ID único
const generarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ========== FUNCIONES SIMULADAS DE API ==========
const api = {
  // Obtener todas las sucursales
  obtenerTodas: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(leerDB()), 300);
    });
  },

  // Crear sucursal
  crear: (sucursal) => {
    return new Promise((resolve) => {
      const sucursales = leerDB();
      const nueva = {
        ...sucursal,
        id: generarId(),
        activa: true,
        fechaCreacion: new Date().toISOString()
      };
      sucursales.push(nueva);
      guardarDB(sucursales);
      setTimeout(() => resolve(nueva), 300);
    });
  },

  // Actualizar sucursal
  actualizar: (id, datos) => {
    return new Promise((resolve, reject) => {
      const sucursales = leerDB();
      const index = sucursales.findIndex(s => s.id === id);
      if (index === -1) return reject('No encontrada');
      sucursales[index] = { ...sucursales[index], ...datos };
      guardarDB(sucursales);
      setTimeout(() => resolve(sucursales[index]), 300);
    });
  },

  // Dar de baja
  darDeBaja: (id) => {
    return api.actualizar(id, { activa: false, fechaBaja: new Date().toISOString() });
  },

  // Dar de alta
  darDeAlta: (id) => {
    return api.actualizar(id, { activa: true, fechaAlta: new Date().toISOString() });
  },

  // Eliminar permanentemente
  eliminar: (id) => {
    return new Promise((resolve, reject) => {
      const sucursales = leerDB();
      const filtradas = sucursales.filter(s => s.id !== id);
      if (filtradas.length === sucursales.length) return reject('No encontrada');
      guardarDB(filtradas);
      setTimeout(() => resolve(), 300);
    });
  }
};

// ========== COMPONENTE PRINCIPAL ==========
function App() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesInactivas, setSucursalesInactivas] = useState([]);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mostrar mensajes
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 4000);
  };

  // Cargar sucursales
  const cargarSucursales = useCallback(async () => {
    try {
      setLoading(true);
      const todas = await api.obtenerTodas();
      setSucursales(todas.filter(s => s.activa));
      setSucursalesInactivas(todas.filter(s => !s.activa));
    } catch (error) {
      showMessage('Error al cargar sucursales', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSucursales();
  }, [cargarSucursales]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ nombre: '', direccion: '', telefono: '' });
    setEditingId(null);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.telefono.trim()) {
      showMessage('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        await api.actualizar(editingId, formData);
        showMessage('Sucursal actualizada correctamente', 'success');
      } else {
        await api.crear(formData);
        showMessage('Sucursal creada correctamente', 'success');
      }
      
      resetForm();
      cargarSucursales();
      
    } catch (error) {
      showMessage('Error al guardar la sucursal', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Editar sucursal
  const handleEdit = (sucursal) => {
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono
    });
    setEditingId(sucursal.id);
  };

  // Dar de baja
  const handleDarDeBaja = async (id) => {
    if (window.confirm('¿Estás seguro de dar de baja esta sucursal?')) {
      try {
        setLoading(true);
        await api.darDeBaja(id);
        showMessage('Sucursal dada de baja correctamente', 'success');
        cargarSucursales();
      } catch (error) {
        showMessage('Error al dar de baja', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Dar de alta
  const handleDarDeAlta = async (id) => {
    if (window.confirm('¿Estás seguro de dar de alta esta sucursal?')) {
      try {
        setLoading(true);
        await api.darDeAlta(id);
        showMessage('Sucursal dada de alta correctamente', 'success');
        cargarSucursales();
      } catch (error) {
        showMessage('Error al dar de alta', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Eliminar permanente
  const handleEliminarPermanente = async (id) => {
    if (window.confirm('¿Eliminar PERMANENTEMENTE? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        await api.eliminar(id);
        showMessage('Sucursal eliminada permanentemente', 'success');
        cargarSucursales();
      } catch (error) {
        showMessage('Error al eliminar', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="header-fijo">
        <div className="logo-container">
          <img 
            src="/Logo.png"
            alt="Gestión Sucursales" 
            className="logo"
          />
        </div>
        <div className="titulo-container">
          <h1 className="titulo-principal">-- Gestión de Sucursales --</h1>
        </div>
      </header>

      <div className="container">
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-container">
          <h2>{editingId ? 'Editar sucursal' : 'Agregar nueva sucursal'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la sucursal"
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Procesando...' : (editingId ? 'Actualizar' : 'Agregar')} Sucursal
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm} disabled={loading}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="toggle-container">
          <button 
            className={`btn-toggle ${mostrarInactivas ? 'btn-inactivas' : 'btn-activas'}`}
            onClick={() => setMostrarInactivas(!mostrarInactivas)}
          >
            {mostrarInactivas ? '-- Ver sucursales activas --' : '-- Ver sucursales inactivas --'}
          </button>
        </div>

        {!mostrarInactivas && (
          <div className="table-container">
            <h2>Sucursales Activas</h2>
            {loading && <div className="loading">Cargando...</div>}
            {!loading && sucursales.length === 0 ? (
              <p className="no-data">No hay sucursales activas</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursales.map((sucursal) => (
                    <tr key={sucursal.id}>
                      <td>{sucursal.id.substring(0, 8)}...</td>
                      <td>{sucursal.nombre}</td>
                      <td>{sucursal.direccion}</td>
                      <td>{sucursal.telefono}</td>
                      <td className="actions">
                        <button className="btn-edit" onClick={() => handleEdit(sucursal)} disabled={loading}>Editar</button>
                        <button className="btn-baja" onClick={() => handleDarDeBaja(sucursal.id)} disabled={loading}>Dar de Baja</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {mostrarInactivas && (
          <div className="table-container inactivas">
            <h2>Sucursales Inactivas</h2>
            {sucursalesInactivas.length === 0 ? (
              <p className="no-data">No hay sucursales inactivas</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursalesInactivas.map((sucursal) => (
                    <tr key={sucursal.id} className="fila-inactiva">
                      <td>{sucursal.id.substring(0, 8)}...</td>
                      <td>{sucursal.nombre}</td>
                      <td>{sucursal.direccion}</td>
                      <td>{sucursal.telefono}</td>
                      <td className="actions">
                        <button className="btn-alta" onClick={() => handleDarDeAlta(sucursal.id)} disabled={loading}>Dar de Alta</button>
                        <button className="btn-delete" onClick={() => handleEliminarPermanente(sucursal.id)} disabled={loading}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;