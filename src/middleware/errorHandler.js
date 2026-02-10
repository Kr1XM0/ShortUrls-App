const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

module.exports = errorHandler;