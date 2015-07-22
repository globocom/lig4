var Player = require('./../models/player');


module.exports = function playerHandler(req, res, next) {

    // POST /player -> envia o codigo e a auth do github
    // > Deve realizar o auth no github.
    // > Testa interface (tem methodos move e done?)
    // > Testa o player do usuario contra um dummyplayer.
    // Salva ou retorna erro

  res.json(200, req.params.name)
  return next()
}
