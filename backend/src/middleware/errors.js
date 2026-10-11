export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      fields: Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message])),
    });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  console.error(err);
  res.status(err.status || 500).json({ error: err.expose ? err.message : 'Server error' });
}
