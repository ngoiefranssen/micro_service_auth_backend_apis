const request = require('supertest');
const app = require('../../../app');
const Utilisateur = require('../../../db/models/admin/utilisateurModel');
const bcrypt = require('bcrypt');
const sequelize = require('../../../db/models').sequelize;

beforeAll(async () => {
    await sequelize.sync({ force: true })
})

describe('Authentification', () => {
    it.only('ça doit pas connecter un utilisateur sans identifiants', async () => {
        const res = await request(app).post('/api/login');

        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toBe('Erreur de validation des données')
        expect(res.body.errors).toBeDefined();
    })

    it.only('ça doit pas connecter un utilisateur avec identifiants incorrects', async () => {
        const body = {
            EMAIL: 'laneuve@example.org',
            PASSWORD: 'wrong-password-12345'
        }
        const res = await request(app).post('/api/login').send(body);

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors).toEqual(expect.objectContaining({ EMAIL: 'Identifiants incorrects' }))
    })

    it.only('ça doit recupèrer tous les utiliseurs', async () => {

        const salt = await bcrypt.genSalt()
        const PASSWORD = await bcrypt.hash('12345678', salt)

        const body = {
            USERNAME: "ngoie",
            EMAIL: "ngoiefranssen@example.org",
            NOM: "Ngoie",
            PRENOM: "Franssen",
            ID_TYPE_USER: 1,
            PASSWORD,
        }

        Utilisateur.create(body);

        const res = await request(app).post('/api/login').send({ EMAIL: body.EMAIL, PASSWORD: '12345678' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.token).toBeDefined();
    })
})