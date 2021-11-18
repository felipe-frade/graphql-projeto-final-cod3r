const db = require('../../config/db')

module.exports = {
    async usuarios() {
        return db('usuarios')
    },
    async usuario(_, { filtro }) {
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