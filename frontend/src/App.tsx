import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch ('http://localhost:3000')
    .then((res) => res.text())
    .then((data) => setMensaje(data));
  }, []);

  return (
    <div>
      <h1>{mensaje || 'Explicacion.....'}</h1>  
    </div>
  );
}


export default App
