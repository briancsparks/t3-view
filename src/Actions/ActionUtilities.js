


export function storifiedAction(FAT_IDENTITY_NAME) {

  var fn = function(data) {
    return (dispatch, getState) => {
      // const store = getState();

      dispatch({
        type    : FAT_IDENTITY_NAME,
        payload : data,
        getState,
        // store,
      })
    }
  };

  fn.fatName = FAT_IDENTITY_NAME;

  return fn;
}

