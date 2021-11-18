const db = require('../../config/db')

module.exports = {
    async perfis(usuario) {
        return db('perfis')
            .join('usuario_perfil', 'perfis.id', 'usuario_perfil.perfil_id')
            .where({ usuario_id: usuario.id })
    }
}