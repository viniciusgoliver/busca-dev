import React from 'react';
import Icon from "../Icon";

import './styles.css';

function DevItem({ dev, onEdit, onDelete }) {
  const [{ editMode, dev: oldDev }, setEditMode] = onEdit;

  function editDev() {    
    setEditMode({
      editMode: oldDev._id !== dev._id ? true : !editMode, // Se selecionou um Dev diferente, obrigatóriamente editMode deve ser true.
      dev // Novo Dev
    });
  }

  function deleteDev() {
    onDelete(dev._id);
  }

  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>  
          <span>{dev.techs.join(', ')}</span>
        </div>              
        <div className="icons">
          <Icon onClick={editDev} type="pen" />
          <Icon onClick={deleteDev} type="trash" />
        </div>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
    </li>
  );
}

export default DevItem;
