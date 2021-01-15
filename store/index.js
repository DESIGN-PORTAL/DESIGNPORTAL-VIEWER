export const state = () => ({
  appid: '',
  openid: '',
})

export const mutations = {
  appid(state, val) {
    state.appid = val
  },
  openid(state, val) {
    state.openid = val
  },
}
