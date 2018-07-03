
import { connect }              from "react-redux";
import Actions                  from '../Actions/Actions';

// import _                        from 'underscore';

import AppComponent from '../App';


const mapStateToProps = (state, ownProps) => {
  const { current }   = state;
  return {current, ...ownProps};
}

const mapDispatchToProps = (dispatch) => {
  const incrCurrentTestCount = (...args) => dispatch(Actions.incrCurrentTestCount(...args));

  return {incrCurrentTestCount};
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;
