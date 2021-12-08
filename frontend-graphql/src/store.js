import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        usuario: null,
    },
    mutations: {
        setUsuario(state, usuario) {
            state.usuario = usuario
        }
    },
    getters: {
        usuario(state) {
            return state.usuario
        },
    },
    actions: {
        setUsuario({ commit }, usuario) {
            commit('setUsuario', usuario)
        }
    }
})