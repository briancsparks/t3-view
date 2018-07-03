
import { connect }              from "react-redux";
import { hot }                  from 'react-hot-loader'
import Actions                  from '../Actions/Actions';

// import _                        from 'underscore';

import AppComponent from '../App';


const mapStateToProps = (state, ownProps) => {
  // const testCount     = state.current.testCount * 3;
  const testCount     = state.current.testCount;
  const { current }   = state;

  return {current:{...current, testCount}, ...ownProps};
}

const mapDispatchToProps = (dispatch) => {
  const incrCurrentTestCount = (...args) => dispatch(Actions.incrCurrentTestCount(...args));

  return {incrCurrentTestCount};
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default hot(module)(App)
// export default App;
