module.exports = function leaderboardHandler(req, res, next) {

  // GET /leaderboard -> retorna todos playes ordernado por score. Params: limit
  res.json(200, req.params.name)
  return next()
}
