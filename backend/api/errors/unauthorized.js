const unauthorized = (res) => {
  return res.status(401).json({
    error: 401,
    error_reason: 'Unauthorized'
  });
}

module.exports = unauthorized;
