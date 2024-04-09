//Rutas de usuarios en auth host + /api/auth
const {validarCampos} = require('../middlewares/validar_campos');
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');

/*router.get('/',(req,res) => {
      res.json({
        ok:true
    })
});*/

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');


router.post(
    '/new',
    [//middlewares
        check('name', 'Es obligatorio el nombre').not().isEmpty(),
        check('email', 'Es obligatorio el email').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ]
    , crearUsuario
);

router.post(
    '/',
    [//Middleware
        check('email', 'Es obligatorio el email').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario);

router.get('/renew', validarJWT, revalidarToken);



module.exports = router;