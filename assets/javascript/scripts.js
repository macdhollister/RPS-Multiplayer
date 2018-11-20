/*
ISSUES:

Still need to account for spectators
both spectator screen and the logic of 
what happens when a spectator enters the game

*/

// jQuery variables
let nameInput = $('#nameInput')
let nameInputRow = $('#nameInputRow');
let gameRow = $('#gameRow');
let selectionRow = $('#selectionRow');
let choiceRow = $('#choiceRow');
let username = $('#username');
let opponent = $('#opponent');
let userImg = $('#playerChoiceImg');
let opponentImg = $('#opponentChoiceImg');
let opponentInfo = $('#opponentInfo');
let waiting = $('#waiting');
let gameLog = $('#gameLog');


gameRow.hide();
choiceRow.hide();
// nameInputRow.hide();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDtkZTgkA6IhFhFYmx88EvXj3ajS2Fo8f8",
    authDomain: "rps-multiplayer-8f05a.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-8f05a.firebaseio.com",
    projectId: "rps-multiplayer-8f05a",
    storageBucket: "rps-multiplayer-8f05a.appspot.com",
    messagingSenderId: "1018950837103"
};

firebase.initializeApp(config);
let database = firebase.database();

// Game Data
let game = {
    player1 : {},
    player2 : {},
    userPersona : undefined,
    userName : undefined,
    theme : 1,
}

database.ref().on("value", function(snapshot) {
    if (snapshot.val() !== null) {
        let p1 = snapshot.val().player1;
        let p2 = snapshot.val().player2;

        if (snapshot.val().player1 !== undefined) {
            game.player1.name = p1.name;
            game.player1.wins = p1.wins;
            game.player1.losses = p1.losses;
            game.player1.ties = p1.ties;
            game.player1.choice = p1.choice;
        } else {
            game.player1 = resetPlayer();
        }

        if (snapshot.val().player2 !== undefined) {
            game.player2.name = p2.name;
            game.player2.wins = p2.wins;
            game.player2.losses = p2.losses;
            game.player2.ties = p2.ties;
            game.player2.choice = p2.choice;
        } else {
            game.player2 = resetPlayer();
        }
    } else {
        game.player1 = resetPlayer();
        game.player2 = resetPlayer();
    }

    if (game.userPersona !== 'spectator') {
        if (game.userPersona === 'player1') {
            $('#playerWins').text(game.player1.wins);
            $('#playerLosses').text(game.player1.losses);
            $('#playerTies').text(game.player1.ties);

            $('#opponentWins').text(game.player2.wins);
            $('#opponentLosses').text(game.player2.losses);
            $('#opponentTies').text(game.player2.ties);

            if (game.player2.name !== undefined) {
                opponentInfo.show();
                waiting.hide();
                opponent.text(game.player2.name);
            } else {
                opponentInfo.hide();
                waiting.show();
                let dots=['.','..','...'];
                let index = 0;
                let dotTimer = setInterval(function() {
                    index = (index+1)%3;
                    $('#dots').text(dots[index]);
                },500);
                $('#chatBox').empty();
            }
        } else if (game.userPersona === 'player2') {
            $('#playerWins').text(game.player2.wins);
            $('#playerLosses').text(game.player2.losses);
            $('#playerTies').text(game.player2.ties);

            $('#opponentWins').text(game.player1.wins);
            $('#opponentLosses').text(game.player1.losses);
            $('#opponentTies').text(game.player1.ties);

            if (game.player1.name !== undefined) {
                opponentInfo.show();
                waiting.hide();
                opponent.text(game.player1.name);
            } else {
                opponentInfo.hide();
                waiting.show();
                let dots=['.','..','...'];
                let index = 0;
                let dotTimer = setInterval(function() {
                    index = (index+1)%3;
                    $('#dots').text(dots[index]);
                },500);
                $('#chatBox').empty();
            }
        }
    } // else if a spectator, show spectator screen

    if (game.player1.choice !== 'none' && game.player2.choice !== 'none') {
        if (game.userPersona === 'player1') {
            let newImg = `assets/images/${game.player2.choice}.png`;
            opponentImg.attr('src', newImg);
        } else if (game.userPersona === 'player2') {
            let newImg = `assets/images/${game.player1.choice}.png`;
            opponentImg.attr('src', newImg);
        }

        let types = ['water', 'fire', 'grass'];

        let p1Choice = game.player1.choice;
        let p1 = types.indexOf(p1Choice.slice(0,-1));
        console.log('p1: ' + p1);
    
        let p2Choice = game.player2.choice;
        let p2 = types.indexOf(p2Choice.slice(0,-1));
        console.log('p2: ' + p2);

        // determines who wins
        if (p1 !== p2) {
            if ((p1+1)%3 === p2) {
                game.player1.wins++;
                game.player2.losses++;
                gameLog.text(game.player1.name + " wins!");
            } else if ((p2+1)%3 === p1) {
                game.player2.wins++;
                game.player1.losses++;
                gameLog.text(game.player2.name + " wins!");
            }
        } else {
            game.player1.ties++;
            game.player2.ties++;
            gameLog.text("It's a tie!");
        }

        let restart = setTimeout(function() {
            game.player1.choice = 'none';
            game.player2.choice = 'none';

            userImg.attr('src', 'assets/images/blank.png');
            opponentImg.attr('src', 'assets/images/blank.png');
            gameLog.empty();
            updateDatabase();

            selectionRow.show();
            choiceRow.hide();
        }, 5000);

    } else {
        opponentImg.attr('src', 'assets/images/blank.png');
    }

});

database.ref().child('chats').on('child_added', function(snapshot) {
    let chatName = snapshot.val().whoSent;
    let chatPersona = snapshot.val().persona;
    let chatMessage = snapshot.val().message;

    let messageFrom;
    let chatClass = 'chatContainer';
    if (chatPersona === game.userPersona) {
        messageFrom = 'user';
    } else {
        messageFrom = 'opponent';
        chatClass += ' darker';
    }

    $('#chatBox').append(
        `<div class="${chatClass}">`
        + `<span class="${messageFrom}Name">${chatName}</span><br>`
        + `<p class="${messageFrom}Text">${chatMessage}</p>`
        + `</div>`
    );

    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);

});

// Updates database with user's choice
$(document).on('click', '.choiceBtn', function() {
    let image = $(this).children('img').attr('src');
    let data = image.split('/').pop().split('.')[0];
    userImg.attr('src', image);

    if (game.userPersona === 'player1') {
        game.player1.choice = data;
    } else if (game.userPersona === 'player2') {
        game.player2.choice = data;
    }

    selectionRow.hide();
    choiceRow.show();

    updateDatabase();
});

// assigns user to a player or spectator
$(document).on('click', '#startPlayer', function(event) {
    event.preventDefault();

    game.userName = nameInput.val().trim();

    if (game.player1.name === undefined) {
        game.player1 = resetPlayer(game.userName);
        game.userPersona = 'player1';
    } else if (game.player2.name === undefined) {
        game.player2 = resetPlayer(game.userName);
        game.userPersona = 'player2';
    } else {
        game.userPersona = 'spectator'
        // Make spectator screen?
    }

    username.text(game.userName);

    // if not a spectator, show game screen
    if (game.userPersona !== 'spectator') {
        nameInputRow.hide();
        gameRow.show();
    } // else if a spectator, show spectator screen

    // finally, update firebase
    updateDatabase();
});

$(document).on('click', '#chatBtn', function(event) {
    event.preventDefault();

    let message = $('#chatInput').val();

    database.ref().child('chats').push({
        whoSent : game.userName,
        persona : game.userPersona,
        message : message
    });

    $('#chatInput').val('');
})

$(document).on('click', '.genButton', function() {
    let gen = $(this).attr('gen');
    let path = 'assets/images/'

    game.theme = gen;

    $('#fire').attr('src', path+'fire'+gen+'.png');
    $('#water').attr('src', path+'water'+gen+'.png');
    $('#grass').attr('src', path+'grass'+gen+'.png');

})

// resets a player to empty
function resetPlayer() {
    let player = {
        wins : 0,
        losses : 0,
        ties : 0,
        choice : 'none'
    }

    if (arguments.length > 0) {
        player.name = arguments[0];
    }

    return player;
}

// updates database with local data
function updateDatabase() {
    if (game.userPersona === 'player1') {
        database.ref().update({
            player1 : game.player1
        })
    } else if (game.userPersona === 'player2') {
        database.ref().update({
            player2 : game.player2
        })
    }
}

// when window is closed/reloaded, remove user from database
$(window).on('unload', function() {
    database.ref(game.userPersona).remove();
    database.ref('chats').remove();
});