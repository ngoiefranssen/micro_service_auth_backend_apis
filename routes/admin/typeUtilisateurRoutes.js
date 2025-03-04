const typeUtilisateursRouter = require('express').Router();
const typeUtilisateurController = require('../../controllers/administrations/typeUtilisateurController');
const verifyToken = require('../../middlewares/verifyToken');

typeUtilisateursRouter.use(verifyToken);

typeUtilisateursRouter.get('/type-users', typeUtilisateurController.findAllElments);
typeUtilisateursRouter.get('/type-users/:ID_TYPE_USER', typeUtilisateurController.findOneElement);
typeUtilisateursRouter.post('/created/type-users', typeUtilisateurController.createdTypeUsers);
typeUtilisateursRouter.put('/updated/type-users/:ID_TYPE_USER', typeUtilisateurController.updatedTypeUser);
typeUtilisateursRouter.post('/deleted/type-users', typeUtilisateurController.deletedTypeUser);

module.exports = typeUtilisateursRouter
