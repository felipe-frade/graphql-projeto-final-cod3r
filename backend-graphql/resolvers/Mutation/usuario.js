const bcrypt = require('bcrypt-nodejs')
const db = require('../../config/db')

function usuario_perfil(perfil_insert, usuario) {
    return new Promise(async (resolve, reject) => {
        let { id, nome } = perfil_insert
                        
        let perfil = null
        if(id){
            perfil = await db('perfis').where({ id }).first()
        }else if(nome){
            perfil = await db('perfis').where({ nome }).first()
        }
    
        if(perfil){
            let dados_usuario_perfil = { usuario_id: usuario.id, perfil_id: perfil.id }
            await db('usuario_perfil').insert(dados_usuario_perfil)
        }

        resolve(perfil)
    })
}

const mutations = {
    async registrarUsuario(_, { dados }) {
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            }
        })
    },
    async novoUsuario(_, { dados }, ctx) {
        ctx && ctx.validarAdmin()

        const { nome, email } = dados
        let usuario = await db('usuarios').where({ email }).first()
        if(!usuario){
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt)

            await db('usuarios').insert( { nome, email, senha: dados.senha } )
            usuario = await db('usuarios').where({ email }).first()

            if(!dados.perfis || !dados.perfis.length){
                dados.perfis = [{
                    nome: 'comum'
                }]
            }
            usuario['perfis'] = []
            for(perfil_insert of dados.perfis){
                await usuario_perfil(perfil_insert, usuario).then(perfil => {
                    usuario['perfis'].push(perfil)
                })
            }
        }else{
            throw new Error('Usuario ja existe!')
        }
        return usuario
    },
    async excluirUsuario(_, { filtro }, ctx) {
        ctx && ctx.validarAdmin()
        
        const { id, email } = filtro
        let usuario = null
        if(id){
            usuario = await db('usuarios').where({ id }).first()
        }else if(email){
            usuario = await db('usuarios').where({ email }).first()
        }
        if(usuario){
            await db('usuario_perfil').where({ usuario_id: usuario.id }).del()
            await db('usuarios').where({ id: usuario.id }).del()

            return usuario
        }else{
            throw new Error('Perfil não existe!')
        }
    },
    async alterarUsuario(_, { filtro, dados }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)

        const { nome, email, senha, perfis} = dados
        let usuario = null
        if(filtro.id){
            usuario = await db('usuarios').where({ id: filtro.id }).first()
        }else if(filtro.email){
            usuario = await db('usuarios').where({ email: filtro.email }).first()
        }

        if(usuario){
            if(dados.senha){
                const salt = bcrypt.genSaltSync()
                dados.senha = bcrypt.hashSync(dados.senha, salt)
            }

            await db('usuarios')
                .update({ nome: nome, nome: usuario.nome, email: usuario.email, senha: usuario.senha, 
                    nome, email, senha })
                .where({ id: usuario.id })

            if(ctx.admin && perfis){
                usuario['perfis'] = []

                if(perfis.length > 0){
                    await db('usuario_perfil').where({ usuario_id: usuario.id }).del()
                    for(perfil_insert of perfis){
                        await usuario_perfil(perfil_insert, usuario).then(perfil => {
                            usuario['perfis'].push(perfil)
                        })
                    }
                }
            }
            return await db('usuarios').where({ id: usuario.id }).first()
        }else{
            throw new Error('Perfil não existe!')
        }
    }
}

module.exports = mutations