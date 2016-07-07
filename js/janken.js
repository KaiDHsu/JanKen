$(function() {
    var winCTX = document.getElementById('wins').getContext('2d'),
        loseCTX = document.getElementById('losses').getContext('2d'),
        drawCTX = document.getElementById('draws').getContext('2d'),
        minutesRef = $('#minutes'),
        secondsRef = $('#seconds'),
        timerForm = $('#timerForm'),
        timerCTX = document.getElementById('timerDisplay').getContext('2d'),
        startRef = $('#start'),
        restartRef = $('#restart'),
        playerRef = $('.janken .player'),
        wins = losses = draws = 0,
        counterInSeconds = 0,
        intervalRef = undefined,
        selectionArray = ["rock", "paper", "scissor"],
        cpuSelectionRef = document.getElementById('cpuSelection'),
        playerSelectionRef = document.getElementById('playerSelection');

    winCTX.font = loseCTX.font = drawCTX.font = timerCTX.font = "30px Nova Square";
    winCTX.textAlign = loseCTX.textAlign = drawCTX.textAlign = timerCTX.textAlign = "center";
    winCTX.fillStyle = 'green';
    loseCTX.fillStyle = 'red';

    /* event bind for on click on start */
    startRef.on('click', function(event) {
        if (event.target.value === 'start' && validateForm()) {
            restartRef[0].removeAttribute('disabled');
            playerRef.children().prop('disabled', false);
            startRef.html('Stop');
            startRef.prop('value', 'stop');
            minutesRef.prop('disabled', true);
            secondsRef.prop('disabled', true);
            gameStarter();
        } else if (event.target.value === 'stop' && validateForm()) {
            resetButtons();
            endGame();
        }
    });

    /* event bind for on click on restart */
    restartRef.on('click', function() {
        if (validateForm()) {
            gameStarter();
        }
    });

    /* event bind for on click of rock-paper-scissor options 
        shifts the selection array around so that the higher index indicates the winner */
    playerRef.on('click', 'button', function(event) {
        var selectionIndex = selectionArray.indexOf(event.target.value),
            playerChoice,
            cpuChoice;

        if (selectionIndex === 0) {
            selectionArray.unshift(selectionArray.pop());
        } else if (selectionIndex === 2) {
            selectionArray.push(selectionArray.shift());
        }

        playerChoice = selectionArray.indexOf(event.target.value);
        cpuChoice = Math.floor(Math.random() * 3);

        playerSelectionRef.className = "selection " + selectionArray[playerChoice];
        cpuSelectionRef.className = "selection " + selectionArray[cpuChoice];

        if (playerChoice === cpuChoice) {
            draws++;
            updateScores("draw");
        } else if (playerChoice > cpuChoice) {
            wins++;
            updateScores("win");
        } else {
            losses++;
            updateScores("loss");
        }
    });

    /* preventing submit action of form used to group validations */
    timerForm.on('submit', function(event) {
        event.preventDefault();
    });

    /* clears and redraws the score canvas, slightly optimized for performance */
    updateScores = function(outcome) {
        switch (outcome) {
            case "loss":
                loseCTX.clearRect(0, 0, 100, 50);
                loseCTX.fillText(losses, 50, 35);
                break;
            case "win":
                winCTX.clearRect(0, 0, 100, 50);
                winCTX.fillText(wins, 50, 35);
                break;
            case "draw":
                drawCTX.clearRect(0, 0, 100, 50);
                drawCTX.fillText(draws, 50, 35);
                break;
            default:
                winCTX.clearRect(0, 0, 100, 50);
                loseCTX.clearRect(0, 0, 100, 50);
                drawCTX.clearRect(0, 0, 100, 50);
                winCTX.fillText(wins, 50, 35);
                loseCTX.fillText(losses, 50, 35);
                drawCTX.fillText(draws, 50, 35);
        }
    };

    /* clears and redraws timerDisplay */
    updateTimer = function() {
        var timerText;
        if (counterInSeconds <= 10) {
            timerCTX.fillStyle = 'red';
            timerText = "You have " + counterInSeconds + "s left!";
        } else {
            timerCTX.fillStyle = 'black';
            timerText = formatTimer(counterInSeconds);
        }
        timerCTX.clearRect(0, 0, 340, 70);
        timerCTX.fillText(timerText, 170, 45);
    };

    gameStarter = function() {
        clearInterval(intervalRef);
        counterInSeconds = 60 * parseInt(minutesRef[0].value) + parseInt(secondsRef[0].value);
        wins = losses = draws = 0;
        updateScores();
        updateTimer();
        intervalRef = setInterval(countdownLoop, 1000);
    };

    validateForm = function() {
        return timerForm[0].checkValidity();
    };

    /* parses input times into Ints and formats them into double digits for use of timerDisplay */
    formatTimer = function(c) {
        var s = c % 60,
            m = (c - s) / 60;
        return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s)
    };

    /* simple countdown timer, may be fractioanlly inaccurate do to processing times.
        other option would be to use the Date object to obtain real time. */
    countdownLoop = function() {
        counterInSeconds--;
        updateTimer();
        if (counterInSeconds === 0) {
            endGame();
        }
    };

    /* calculates winner and displays */
    endGame = function() {
        clearInterval(intervalRef);
        resetButtons();
        if (wins === losses) {
            alert("It's a Draw!");
        } else if (wins > losses) {
            alert("You Win!");
        } else {
            alert("You Lose...");
        }
    };

    resetButtons = function() {
        startRef.html('Start');
        startRef.prop('value', 'start');
        restartRef.prop('disabled', true);
        playerRef.children().prop('disabled', true);
        minutesRef.prop('disabled', false);
        secondsRef.prop('disabled', false);
    }

    updateScores();
    timerCTX.fillText("00:00", 170, 45);
});
