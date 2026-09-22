import React, { useState, useEffect } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('Cargando mensaje...');

  useEffect(() => {
    fetch('http://localhost:4000/')
        .then(res => res.text())
        .then(data => setMensaje(data))
        .catch(() => setMensaje('Error al cargar el mensaje'));
  }, []);

  return (
      <div>
        <h1>Mensaje del Servidor:</h1>
        <p>{mensaje}</p>
      </div>
  );
}

export default App;