
const questionTimer = 12;
const questionInterval = 4;
let timer;
let time = 0;

// Trivia Question Array
const questions = [
    {
        question: 'The Lord of the Rings movies are based on a novel by what author?',
        choices: ["J.K. Rowling", "J.R.R. Tolkein", "J.M. Barrie", "H.G. Wells"],
        correctIndex: 1,
    },
    {
        question: 'What is the first voice we hear in The Fellowship of the Ring',
        choices: ['Galadriel', 'Frodo', 'Bilbo', 'Gandalf'],
        correctIndex: 0,
    },
    {
        question: 'What is the name of the Ent who carries Pippin and Merry through Fangorn Forest?',
        choices: ['Greybranch', 'Quickbeam', 'Treebeard', 'Skinbark'],
        correctIndex: 2,
    },
    {
        question: 'Who is the spy in Rohan?',
        choices: ['Gimli', 'Gollum', 'Gamling', 'Grima'],
        correctIndex: 3,
    },
    {
        question: 'Who kills the Witch King?',
        choices: ['Gandalf', 'Aragorn', 'Arwen', 'Eowyn'],
        correctIndex: 3,
    },
    {
        question: 'How many Academy Awards did the LOTR trilogy win?',
        choices: [4, 7, 11, 17],
        correctIndex: 3,
    },
];

// Game Vars
const game = {
    currentQuestion: 0,
    choice: -1,
    correctScore: 0,
    incorrectScore: 0,
    unanswered: 0,

    resetGame() {
        this.currentQuestion = 0;
        this.choice = -1;
        this.correctScore = 0;
        this.incorrectScore = 0;
        this.unanswered = 0;
    }
}

function secondsToMiliseconds(seconds) {
    return 1000 * seconds;
}


// 
$(document).ready(function () {

    function startQuestionTimer() {
        time = questionTimer;
        timer = setInterval(showTime, secondsToMiliseconds(1));
    }

    // Time between questions
    function startQuestionResultTimer() {
        time = questionInterval;
        timer = setInterval(function () {
            time--;
            if (time === 0) {
                stopTimer();
                if (game.currentQuestion === questions.length) {
                    endGame();
                } else {
                    showQuestion();
                }
            }
            $('#time-remaining').text(time);
        }, secondsToMiliseconds(1));
    }

    function stopTimer() {
        clearTimeout(timer);
    }

    function showTime() {
        time--;
        if (time === 0) {
            stopTimer();
            showResult();
        }
        $('#time-remaining').text(time);
    }

    function showQuestion() {
        let index = 0;
        clearHtml();
        $('#question-number-section').show();
        $('#question-number').text(game.currentQuestion + 1);
        const question = questions[game.currentQuestion];
        $('#question').html(question.question);

        // Show choices per question
        question.choices.forEach(item => {
            const choice = $('<div>').addClass('form-check');
            const input = $('<input>')
                .addClass('form-check-input')
                .attr('type', 'radio')
                .attr('name', 'choice')
                .attr('value', index)
            const label = $('<label>').addClass('form-check-label').text(item);

            choice.append(input).append(label)
            $('#choices').append(choice);
            index++;
        });
        startQuestionTimer();
        $('#submit-choice').show()
    }

    function clearHtml() {
        $('#result').empty();
        $('#question').empty();
        $('#choices').empty();
        $('#submit-choice').hide();
    }

    function showResult() {
        $('#question-number-section').hide();
        stopTimer();
        $('#time-remaining').text(questionInterval);
        clearHtml();

        const messageElement = $('<h2>');
        const correctAnswerElement = $('<h2>');

        const currentQuestion = game.currentQuestion;
        const question = questions[currentQuestion];
        const correctAnswerIndex = question.correctIndex
        const correctAnswer = question.choices[correctAnswerIndex]
        const choice = game.choice

        if (time === 0) { // Time ran out, no answer submitted
            messageElement.text('Out of time!');
            game.unanswered++;
        } else { // Answer submitted
            if (correctAnswerIndex === choice) { // Answer is correct
                messageElement.text("Nice job!")
                game.correctScore++;
            } else { // Answer is incorrect
                messageElement.text('Wrong!');
                game.incorrectScore++;
            }
        }
        correctAnswerElement.text("The correct answer is: " + correctAnswer);
        $('#result').append(messageElement).append(correctAnswerElement);
        game.choice = -1;
        game.currentQuestion++;
        startQuestionResultTimer();
    }

    // End of game results
    function endGame() {
        $('#question-number-section').hide();
        clearHtml();
        $('#restart').show();
        let correctAnswerElement = $('<p>');
        let incorrectAnswerElement = $('<p>');
        let unansweredElement = $('<p>');

        correctAnswerElement.text('Correct answers: ' + game.correctScore);
        incorrectAnswerElement.text('Incorrect answers: ' + game.incorrectScore);
        unansweredElement.text('Unanswered questions: ' + game.unanswered);

        $('#result')
            .append('<h2>End of game score!</h2>')
            .append(correctAnswerElement)
            .append(incorrectAnswerElement)
            .append(unansweredElement);
    }

    $('#submit-choice').click(function () {
        // Get value from radio button
        const index = $("input[name='choice']:checked").val();
        // No choice selected...
        if (!index) {
            if (!$('#warn').length) {
                let warningDiv = $('<div id="warn" class="alert alert-warning" role="alert">You must make a selection before submitting!</div>');
                $('#result').append(warningDiv);
            }
        } else {
            $('#warn').remove();
            game.choice = parseInt(index);
            stopTimer();
            showResult();
        }
    });

    // Start Game Button
    $('#start').click(function () {
        $('#start').hide();
        $('#time').show();
        $('#question-number-section').show();
        showQuestion();
    });

    // Restart Game Button
    $('#restart').click(function () {
        $('#restart').hide();
        game.resetGame();
        showQuestion();
    });

    function main() {
        $('#question-number-section').hide();
        $('#submit-choice').hide();
        $('#time').hide();
        $('#restart').hide();
    }
    main();
});

