import Moveable from "react-moveable";
import { useState, useEffect, useRef } from "react";

const LateralBar = () => {
    const fileInputRef = useRef(null);
    const [content, setContent] = useState(null);
    const [containerBounds, setContainerBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
    const containerRef = useRef(null);
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
    const handleAnchorClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };
    
    useEffect(() => {
        // 1. Esto debe ir al principio para asegurar que se calcule
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setContainerBounds({
                left: 0,
                top: 0,
                right: offsetWidth,
                bottom: offsetHeight,
            });
        }

        function handleClickOutside(event) {
            // Usar closest es más seguro por si clickeas un hijo del target
            if (!event.target.closest(".target")) {
                setTarget(null);
                setActiveId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        // 2. EL RETURN SIEMPRE AL FINAL
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="columns">
            <div className="column is-one-quarter sidebar">
                <aside className="menu">
                <p className="menu-label">
                    Elements
                </p>
                <ul className="menu-list">
                    <li><a>Image</a></li>
                    <li><a>Text</a></li>
                </ul>
                <p className="menu-label">
                    Import/Export
                </p>
                <ul className="menu-list">
                    <li><a 
                        href="#"
                        onClick={handleAnchorClick}
                    >
                        Import JSON
                    </a></li>
                    <li><a onClick={dowloadJSON}>Export JSON</a></li>
                </ul>
                </aside>
            </div>

            <div className="column">
                <div className="box">
                    <div className="content" ref={containerRef}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept=".json" 
                            onChange={loadJSON}
                            style={{ display: "none" }}
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
                                snappable={true}      // 2. ACTIVA EL SNAPPING
                                bounds={containerBounds} // 3. PASA LOS LÍMITES
                                origin={false}
                                onDrag={({ target, transform }) => {
                                    target.style.transform = transform;
                                    // Tu lógica de setElements está perfecta
                                    const newsElements = elements.map(el => 
                                        el.id === activeId ? { ...el, transform } : el
                                    );
                                    setElements(newsElements);
                                }}
                            />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LateralBar;