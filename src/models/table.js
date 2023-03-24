export default {
  state: {loading: false},
  reducers: {
    onLoading(prevState, loading) {
      return {
        loading
      };
    },
  },
};
