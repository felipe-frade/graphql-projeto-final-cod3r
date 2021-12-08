const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
const { getUsuarioLogado } = require('../comum/usuario');
const { addErrorLoggingToSchema } = require('graphql-tools');

module.exports = {
    async login(_, { dados }){
        const usuario = await db('usuarios')
            .where({ email: dados.email })
            .first()
        
        if(!usuario){
            throw new Error('Usuário/senha inválido!')
        }

        const saoIguais = bcrypt.compareSync(dados.senha, usuario.senha)

        if(!saoIguais){
            throw new Error('Usuário/senha inválido!')
        }

        return getUsuarioLogado(usuario)
    },
    async usuarios(obj, args, ctx) {
        ctx && ctx.validarAdmin()
        return db('usuarios')
    },
    async usuario(_, { filtro }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)

        const { id, email } = filtro

        if(id){
            return db('usuarios').where({id}).first()
        }else if(email){
            return db('usuarios').where({email}).first()
        }else{
            throw new Error('Parametro não reconhecido!')
        }
    },
}