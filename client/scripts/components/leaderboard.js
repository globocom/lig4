'use strict';

function LeaderBoard(data) {
  var container = document.getElementById('ranking').firstChild;
  var table = document.createElement('table');
  var size = data.length > 10 ? 10 : data.length;

  table.className = 'leader-board';

  // generate positions
  for (var i = 0; i < size; i++) {
    var leaderBoardItem = data[i];
    var tableRow = document.createElement('tr');
    var cellPos = document.createElement('td');
    var cellPlayer = document.createElement('td');
    var cellScore = document.createElement('td');

    cellPos.className = 'leader-board__position';
    cellPlayer.className = 'leader-board__player';
    cellScore.className = 'leader-board__score';

    cellPos.innerHTML = '#' + String(i + 1);
    cellPlayer.innerHTML = leaderBoardItem.player
    cellScore.innerHTML = leaderBoardItem.score;

    tableRow.appendChild(cellPos);
    tableRow.appendChild(cellPlayer);
    tableRow.appendChild(cellScore);

    var title = [
      'Vitórias: ', leaderBoardItem.win, ' | ',
      'Empates: ', leaderBoardItem.draw, ' | ',
      'Derrotas: ', leaderBoardItem.lost, ' | ',
      'Games Pró: ', leaderBoardItem.gamesFor, ' | ',
      'Games contra: ', leaderBoardItem.gamesAgainst, ''
    ].join('')
    tableRow.setAttribute('title', title);

    table.appendChild(tableRow);
  }

  // insert board into container
  container.appendChild(table);
}


module.exports = LeaderBoard;
