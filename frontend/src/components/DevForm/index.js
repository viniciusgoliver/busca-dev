import React, { useState, useEffect } from 'react';

import "./styles.css";

function DevForm({ onAdd, onEdit, editModeState }) {
  const [{ editMode, dev }, setEditMode] = editModeState;
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');  

  useEffect(() => {
    if (!editMode) {
      // Localização do navegador (Pois o usuário está cadastrando)
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          setLatitude(latitude);
          setLongitude(longitude);
        },
        err => {
          console.log(err);
        },
        {
          timeout: 30000
        }
      );
    }else{      
      // Localização do dev selecionado (Pois o usuário está editando)      
      const {
        github_username,
        techs,        
        location: {
          coordinates: [longitude, latitude]
        }
      } = dev;
      setGithubUsername(github_username);      
      setTechs(techs.join(", "));
      setLatitude(latitude);
      setLongitude(longitude);            
    }        
  }, [editMode, dev]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editMode) {            
      await onEdit(dev, {
        github_username,
        techs,        
        latitude,
        longitude
      });      
      setGithubUsername("");
      setTechs("");         
      setEditMode({ editMode: false, dev: {} });                  
    }else{
      await onAdd({
        github_username,
        techs,
        latitude,
        longitude
      });
      setGithubUsername("");
      setTechs("");    
    }            
  }  

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github</label>
        <input
          name="github_username"
          id="github_username"
          required
          value={github_username}
          onChange={e => setGithubUsername(e.target.value)}
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input
          name="techs"
          id="techs"
          required
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            name="latitude"
            id="latitude"
            required
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            name="longitude"
            id="longitude"
            required
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
          />
        </div>                               
      </div> 
      <button type="submit">Salvar</button>
    </form>
  );
}

export default DevForm;
