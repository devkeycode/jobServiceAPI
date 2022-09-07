//This middleware contains the logic for validating request bodies coming along with  signin requests.

exports.validateSignInRequestBody = (req, res, next) => {
  const { userId, password } = req.body;
  if (!userId) {
    return res.status(400).json({
      message: "UserId is required field and is not provided.",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Password is required field and is not provided.",
    });
  }
  //all validation passed, so pass the control to next
  next();
};
