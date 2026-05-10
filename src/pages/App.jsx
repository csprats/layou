import Moveable from "react-moveable";
import { useState, useEffect } from "react";

const App = () => {
  const [target, setTarget] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [elements, setElements] = useState([
    {
      id: "1",
      tipe: "image",
      src: "https://dummyimage.com/200x200/",
      transform: "translate(300px, 200px) rotate(0deg)"
    },
    {
      id: "2",
      tipe: "text",
      content: "Hola Canva",
      transform: "translate(200px, 100px) rotate(0deg)"
    }
  ]);
  const dowloadJSON = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elements.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const loadJSON = (event) => {
    const archive = event.target.files[0]; 
    if (!archive) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // e.target.result contiene el texto del archivo
        const json = JSON.parse(e.target.result);
        
        // Actualizamos el estado de la app
        setElements(json);
        
        // Limpiamos la selección actual para que Moveable no se confunda
        setTarget(null);
        setActiveId(null);
      } catch (err) {
        alert("El archivo no es un JSON válido");
        console.error("Error al parsear:", err);
      }
    };

    reader.readAsText(archive);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.classList.contains("target")) {
        setTarget(null);
        setActiveId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <button onClick={dowloadJSON}>Descargar JSON</button>
      <br />
      <input 
        type="file" 
        accept=".json" 
        onChange={(e) => loadJSON(e)} 
      />
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        {elements.map((el) => (

          <div
            key={el.id}
            className={`target tipe-${el.tipe} ${activeId === el.id ? 'target-active' : ''}`}
            onClick={(e) => {
              setTarget(e.currentTarget);
              setActiveId(el.id);
            }}
            style={{
              // Solo dejamos aquí lo que cambia por objeto (geometría)
              width: el.width,
              height: el.height,
              transform: el.transform,
            }}
          >
          {el.tipe === "image" && (
            <img 
              src={el.src} 
              alt="Elemento" 
              style={{ 
                width: "100%", 
                height: "100%", 
                pointerEvents: "none", // ¡ESTO ES CLAVE!
                objectFit: "cover" 
              }} 
            />
          )}
          {el.content}
          </div>
        ))}
        
        {target && (
          <Moveable
            target={target}
            draggable={true}
            origin={false}
            onDrag={({ target, transform }) => {
              target.style.transform = transform;

              const newsElements = elements.map(el => {
                if (el.id === activeId) {
                  return { ...el, transform: transform };
                }
                return el;
              });
              setElements(newsElements);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
