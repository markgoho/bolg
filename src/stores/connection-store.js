export default {
  state: {
    connected: true,
  },
  mutations: {
    ONLINE(state) {
      state.connected = true;
    },

    OFFLINE(state) {
      state.connected = false;
    },
  },
};
