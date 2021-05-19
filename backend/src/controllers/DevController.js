const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {    
  async olaMundo(request, response) {
    const msg = "Olá Mundo";

    return response.status(200).json(msg);
  },
  
  async index(request, response) {
    const devs = await Dev.find();

    return response.json({devs: devs});
  },

  async show(request, response) {

    const { id } = request.params;
    const dev = await Dev.findById({_id:id});

    return response.status(200).json(dev);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
 
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })     

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev);

      return response.json({ type: "success", message: "Dev cadastrado com sucesso", dev: dev });
    }else{
      return response.json({ type: "error", message: "Dev já cadastrado no Banco de Dados" });
    }
  },  

  async update(request, response) {
    const { id } = request.params;
    const { github_username, techs, latitude, longitude } = request.body;
    
    let dev = await Dev.findOne({ github_username });
    
    if (dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
 
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      await Dev.findByIdAndUpdate(
        id ,
       {
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
       }
     );     

     return response.json({ type: "success", message: "Dev atualizado com sucesso", devs: dev });
    }else{
      return response.json({ type: "error", message: "Dev não encontrado no Banco de Dados" });     
    }    
  },

  async destroy(request, response){
    const {id} = request.params;

    const dev = await Dev.findOne({ _id: id });

    if (dev) {
      await Dev.deleteOne({ _id: id });
      return response.json({ type: "success", message: "Dev removidocom sucesso" });
    }else{
      return response.json({ type: "error", message: "Dev não encontrado" });
    }            
  }
};
