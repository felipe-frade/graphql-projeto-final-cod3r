const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    // en dev
    await require('./simularUsuarioLogado')(req)

    const auth = req.headers.authorization
    const token = auth && auth.split(' ')[1]

    let usuario = null
    let admin = false

    if(token){
        try {
            let conteudo = jwt.decode(token, 
                process.env.AUTH_SECRET)

            if(new Date(conteudo.exp * 1000) > new Date()){
                usuario = conteudo
            }
        } catch (e) {
            // token inválido
        }
    }

    if(usuario && usuario.perfis){
        admin = usuario.perfis.includes('admin')
    }

    const err = new Error('acesso negado')

    return {
        usuario,
        admin,
        validarUsuario() {
            if(!usuario) throw err
        },
        validarAdmin() {
            if(!admin) throw err
        }
    }
}