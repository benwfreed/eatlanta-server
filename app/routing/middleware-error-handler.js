module.exports = function(res, message, status) {
  const errorMessage = message;
  const resStatus = status;
  return function(message, status, externalErr) {
    res.status = status || resStatus;
    const response = {
      message: message || errorMessage
    }
    if (externalErr) {
      response.error = externalErr;
    }
    res.json(response);
  };
}
