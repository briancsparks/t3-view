
import { connect }              from "react-redux";
import { hot }                  from 'react-hot-loader'
import Actions                  from '../Actions/Actions';

// import _                        from 'underscore';

import AppComponent from '../App';


const mapStateToProps = (state, ownProps) => {
  const { current  }     = state;
  const { testCount =0 }    = current;

  // const result = {current:{...current, testCount:testCount*3}, ...ownProps};
  const result = {current:{...current, testCount}, ...ownProps};
  return result;
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
