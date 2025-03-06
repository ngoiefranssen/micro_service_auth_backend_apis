const mainRouter = require('express').Router();

const utilisateursRoutes = require('./admin/utilisateurRoutes')
const authRoutes = require('./auth/authRoutes');
const profilsRouter = require('./admin/profilRoutes');
const rolesRouter = require('./admin/roleRoutes');
const typeUtilisateurRoutes = require('./admin/typeUtilisateurRoutes');
const typeContratRouters = require('./contrats/typeContratRoutes');
const typeVehiculesRouters = require('./vehicules/typeVehiculesRoutes');
const etatCivileRouters = require('./Others/etatCivilRoutes');
const typeVersementRouters = require('./versements/typeVersementRoutes');
const marquesRouters = require('./vehicules/marqueRoutes');
const genreRouters = require('./Others/genreRoutes');
const paysRouters = require('./Others/paysRoutes');
const typeMouvementRouters = require('./Others/typeMouvementRoutes');

mainRouter.use(authRoutes);
mainRouter.use(utilisateursRoutes);
mainRouter.use(profilsRouter)
mainRouter.use(rolesRouter)
mainRouter.use(typeUtilisateurRoutes)
mainRouter.use(typeContratRouters)
mainRouter.use(typeVehiculesRouters)
mainRouter.use(etatCivileRouters)
mainRouter.use(typeVersementRouters)
mainRouter.use(marquesRouters)
mainRouter.use(genreRouters)
mainRouter.use(paysRouters)
mainRouter.use(typeMouvementRouters)

module.exports = mainRouter;