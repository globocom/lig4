'use strict';

function LeaderBoard(element) {
  var container = this.container = element;
  var tableHead = this.tableHead = document.createElement('thead');
  var tableBody = this.tableBody = document.createElement('tbody');
  var self = this;

  var headRow = document.createElement('tr');
  var headColPosition = document.createElement('td');
  var headColWins = document.createElement('td');
  var headColDraws = document.createElement('td');
  var headColLosses = document.createElement('td');
  var headColScore = document.createElement('td');

  container.className = 'leader-board';
  headColPosition.className = 'leader-board__position';
  headColWins.className = 'leader-board__wins';
  headColDraws.className = 'leader-board__draws';
  headColLosses.className = 'leader-board__losses';
  headColScore.className = 'leader-board__score';

  headColPosition.innerHTML = 'Melhores jogadores';
  headColWins.innerHTML = 'V';
  headColDraws.innerHTML = 'E';
  headColLosses.innerHTML = 'D';

  headColWins.title = 'Vitórias';
  headColDraws.title = 'Empates';
  headColLosses.title = 'Derrotas';

  container.innerHTML = '';

  headRow.appendChild(headColPosition);
  headRow.appendChild(headColWins);
  headRow.appendChild(headColDraws);
  headRow.appendChild(headColLosses);
  tableHead.appendChild(headRow);

  container.appendChild(tableHead);
  container.appendChild(tableBody);

  return {
    load: self.load.bind(self),
  }
}

LeaderBoard.prototype.load = function (data) {
  var tableBody = this.tableBody;
  var size = data.length;

  // clean old board
  tableBody.innerHTML = '';

  // generate positions
  for (var i = 0; i < size; i++) {
    var position = data[i];
    var row = document.createElement('tr');
    var colPosition = document.createElement('td');
    var colWins = document.createElement('td');
    var colDraws = document.createElement('td');
    var colLosses = document.createElement('td');
    var colScore = document.createElement('td');

    row.className = 'leader-board__player';
    colPosition.className = 'leader-board__position';
    colWins.className = 'leader-board__wins';
    colDraws.className = 'leader-board__draws';
    colLosses.className = 'leader-board__losses';

    colPosition.innerHTML = ['<b>#' + (i + 1) + '</b>', position.player + ',', position.score, 'pt\'s'].join(' ');
    colWins.innerHTML = position.win;
    colDraws.innerHTML = position.draw;
    colLosses.innerHTML = position.lost;

    colWins.title = position.win + ' vitórias';
    colDraws.title = position.draw + ' empates';
    colLosses.title = position.lost + ' derrotas';

    row.appendChild(colPosition);
    row.appendChild(colWins);
    row.appendChild(colDraws);
    row.appendChild(colLosses);
    tableBody.appendChild(row);
  }
}

module.exports = LeaderBoard;
