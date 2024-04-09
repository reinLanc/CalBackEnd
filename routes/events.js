const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');


const router = Router();

//Deben validarse
router.use(validarJWT);
//Obtener eventos
router.get('/', getEvento);

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finañización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento);

//Actualizar evento
router.put('/:id', actualizarEvento);

//Eliminar evento
router.delete('/:id', eliminarEvento);

module.exports = router;