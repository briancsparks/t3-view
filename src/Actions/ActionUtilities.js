


export function storifiedAction(FAT_IDENTITY_NAME) {

  var fn = function(data, debugInfo) {
    return (dispatch, getState) => {
      const store = getState();

      dispatch({
        type    : FAT_IDENTITY_NAME,
        payload : data,
        getState,
        store,
        debugInfo
      })
    }
  };

  fn.fatName = FAT_IDENTITY_NAME;

  return fn;
}

export function plainAction(FAT_IDENTITY_NAME) {

  var fn = function(data, debugInfo) {
    return (dispatch) => {

      dispatch({
        type    : FAT_IDENTITY_NAME,
        payload : data,
        debugInfo
      })
    }
  };

  fn.fatName = FAT_IDENTITY_NAME;

  return fn;
}

