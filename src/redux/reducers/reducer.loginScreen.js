export default {
  dispatch: [
    {
      case: 'SET_LOGIN_STATUS',
      stateKey: 'login_status',
      setFunction: 'setloginStatus',
    },
    {
      case: 'COUNT',
      stateKey: 'count',
      setFunction: 'setCount',
    },
  ],
  state: {login_status: false, count: 0},
};
