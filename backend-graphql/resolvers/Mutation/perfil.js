const db = require('../../config/db')
const { perfil: get_perfil } = require('../Query/perfil')

module.exports = {
    async novoPerfil(_, { dados }) {
        const { nome, rotulo } = dados
        let perfil = await db('perfis').where({ nome }).first()
        if(!perfil){
            await db('perfis').insert( { nome, rotulo } )
            perfil = await db('perfis').where({ nome }).first()
        }else{
            throw new Error('Perfil ja existe!')
        }
        return perfil
    },
    async excluirPerfil(_, { filtro }) {
        const { id, nome } = filtro
        let perfil = await get_perfil(_, { filtro })
        if(perfil){
            await db('perfis').where({ id: perfil.id }).del()

            return perfil
        }else{
            throw new Error('Perfil não existe!')
        }
    },
    async alterarPerfil(_, { filtro, dados }) {
        const { nome, rotulo } = dados
        let perfil = null
        if(filtro.id){
            perfil = await db('perfis').where({ id: filtro.id }).first()
        }else if(filtro.nome){
            perfil = await db('perfis').where({ nome: filtro.nome }).first()
        }

        if(perfil){
            await db('perfis').update({ ...perfil, nome, rotulo }).where({ id: filtro.id })

            return await db('perfis').where({ id: perfil.id }).first()
        }else{
            throw new Error('Perfil não existe!')
        }
    }
}