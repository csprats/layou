import Moveable from "react-moveable";
import { useState } from "react";
import { useEffect, useRef } from "react";

const App = () => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Si el clic NO es en uno de nuestros objetos "target", deseleccionamos
      if (!event.target.classList.contains("target")) {
        setTarget(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div 
        className="target" 
        onClick={e => setTarget(e.target)}
        style={{ width: "100px", height: "100px", background: "#eee" }}
      >
        Haz click para moverme
      </div>

      <div 
        className="target" 
        onClick={e => setTarget(e.target)}
        style={{ width: "100px", height: "100px", background: "#eee" }}
      >
        Haz click para moverme
      </div>
      
      {target && (
        <Moveable
          target={target}
          draggable={true} // IMPORTANTE: Sin esto no se moverá
          origin={false}    // El punto rojo central
          onDrag={e => {
            // Aplicar la transformación directamente al target
            e.target.style.transform = e.transform;
          }}
        />
      )}
      
    </div>
  );
};

export default App;
