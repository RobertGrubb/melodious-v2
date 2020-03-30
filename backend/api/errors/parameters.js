const parameters = (res) => {
  return res.status(500).json({
    error: 500,
    error_reason: 'Missing parameters'
  });
}

module.exports = parameters;
