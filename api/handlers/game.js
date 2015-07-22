
module.exports = function gameHandler (req, res, next) {

  // GET /game -> retorna players [{player, winner}, {player}], moves [{player, position}], board (final)
  res.json(200, req.params.name)
  return next()
}
