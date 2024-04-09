const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
//logica de las funciones y rutas

const crearUsuario = async (req, res = response) => {

  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    //validación con codigo de error para mejor interpretacion y reaccione postman
    //AHORA ESTA HECHO CON EXPRESS VALIDATOR
    /*if (name.length < 2) {
      return res.status(400).json({
        ok: false,
        msg: 'el nombre debe ser de al menos dos letras'
      });
    }*/

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario con ese correo ya existe.'
      });
    }

    usuario = new Usuario(req.body);

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //guardar
    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);


    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Por favor hable con el administrador.'
    });
  }
}


const loginUsuario = async (req, res = response) => {
  //aca solo se pide email y password para login (el nombre no.)
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }
    //Confirmar contraseñas
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto.'
      });
    }

    //Generar nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);



    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Por favor hable con el administrador.'
    });
  }
}

const revalidarToken = async(req, res = response) => {
  const { uid, name } = req; 

  //generar nuevo JWT
  const token = await generarJWT( uid, name );

    res.json({
      ok: true,
      token
    })
}


module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}