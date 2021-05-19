import React, { useState, useEffect } from "react";
import { Preloader, Oval, ThreeDots } from 'react-preloader-icon';

import api from "./services/api";

import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";

import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

// Component  : Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação (Obs.: Primeira Letra Maiúscula)
// Propriedade: Informações que um componente "Pai" passa para o componente "Filho"
// Estado     : Informações mantida pelo componente (Lembrar: imutabilidade)

function App() {
  const editModeState = useState({ editMode: false, dev: {} });
  const [devs, setDevs] = useState([]);
  const [{ editMode }] = editModeState;  
  const [loading, setLoading] = useState(false);

  // Load devs
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("devs");

      setDevs(response.data.devs);
            
    }
    loadDevs();
  }, []);

  async function handleAddDev(data) {
    setLoading(true);
    const response = await api.post("devs", data);
    const { data: newDev } = response;
    let add = true;
    for (let oldDev in devs) if (devs[oldDev]._id === newDev._id) add = false;
    if (add)
      // Evitar adicionar duplicatas
      setDevs([...devs, newDev.dev]); // Spread para manter imutabilidade
      setLoading(false);
  }

  async function handleEditDev(dev, data) {    
    setLoading(true);
    const { github_username } = dev;
    const newDevs = devs.map(async dev => {
      if (dev.github_username === github_username) {        
        const response = await api.put(`devs/${dev._id}`, data);
        
        if (response.data.modifiedCount > 0) {
          const newDev = await api.get(`devs/${dev._id}`);          
          return newDev.data;
        } else {          
          const newDev = await api.get(`devs/${dev._id}`);          
          return newDev.data;
        }         
      } else return dev;
    });
    (async () => {
      const resultado = await Promise.all(newDevs);
      setDevs(resultado);      
      setLoading(false);
    })();
  }

  async function handleDelDev(github) {
    await api.delete(`devs/${github}`);
    setDevs(devs.filter(dev => dev._id !== github));
  }

  return (
    <div id="app">    
      <aside>
        <strong>{editMode ? "Editar" : "Cadastrar"}</strong>
        <DevForm
          onAdd={handleAddDev}
          onEdit={handleEditDev}
          editModeState={editModeState}
        />
        {loading && <div className="loadingStart">
                    <Preloader
                      use={ThreeDots}
                      size={80}
                      strokeWidth={8}
                      strokeColor="#6931ca"
                      duration={800}
                    /> 
                  </div>
      }
      </aside>
      <main>        
        <ul>        
          {devs.map(dev => (
            <DevItem
              key={dev._id}
              dev={dev}
              onEdit={editModeState}
              onDelete={handleDelDev}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
