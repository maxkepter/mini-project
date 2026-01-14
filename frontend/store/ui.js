export const state = () => ({
    sidebarCollapsed: false
})

export const mutations = {
    toggleSidebar(state) {
        state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, value) {
        state.sidebarCollapsed = value
    }
}

export const actions = {
    toggleSidebar({ commit }) {
        commit('toggleSidebar')
    },
    setSidebarCollapsed({ commit }, value) {
        commit('setSidebarCollapsed', value)
    }
}

export const getters = {
    sidebarCollapsed: state => state.sidebarCollapsed,
    sidebarWidth: state => state.sidebarCollapsed ? '0px' : '250px'
}
