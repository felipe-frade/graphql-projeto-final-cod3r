const db = require('../../config/db')

module.exports = {
    async perfis(_, args, ctx) {
        ctx && ctx.validarAdmin()
        return db('perfis')
    },
    async perfil(_, { filtro }, ctx) {
        ctx && ctx.validarAdmin()
        const { id, nome } = filtro

        if(id){
            return db('perfis').where({id}).first()
        }else if(nome){
            return db('perfis').where({nome}).first()
        }else{
            throw new Error('Parametro não reconhecido!')
        }
    }
}