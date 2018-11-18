/*
ISSUES:

Still need to account for spectators
both spectator screen and the logic of 
what happens when a spectator enters the game


*/

// jQuery variables
nameInput = $('#nameInput')
nameInputRow = $('#nameInputRow');
gameRow = $('#gameRow');
username = $('#username');
opponent = $('#opponent');

gameRow.hide();
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
            game.player1.choice = p1.choice;
        }

        if (snapshot.val().player2 !== undefined) {
            game.player2.name = p2.name;
            game.player2.wins = p2.wins;
            game.player2.losses = p2.losses;
            game.player2.choice = p2.choice;
        }
    }

    if (game.userPersona !== 'spectator') {
        if (game.userPersona === 'player1') {
            if (game.player2.name !== undefined) {
                opponent.text(game.player2.name);
            } else {
                opponent.text('Waiting for another player to join...');
            }
        } else if (game.userPersona === 'player2') {
            if (game.player1.name !== undefined) {
                opponent.text(game.player1.name);
            } else {
                opponent.text('Waiting for another player to join...');
            }
        }
    } // else if a spectator, show spectator screen

    

    /*
    with these values stored, update columns respectively
    This should be done in a separate function so that it can also
    be called with the "click" function for the form submit
    */
});

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
        if (game.userPersona === 'player1') {
            if (game.numPlayers === 2) opponent.text(game.player2.name);
            else opponent.text('Waiting on a second player...');
        } // if userpersona is player2, same thing
    } // else if a spectator, show spectator screen

    // finally, update firebase
    if (game.userPersona === 'player1') {
        database.ref().update({
            player1 : game.player1
        })
    } else if (game.userPersona === 'player2') {
        database.ref().update({
            player2 : game.player2
        })
    }

    console.log(game);
});

function resetPlayer() {
    let player = {
        wins : 0,
        losses : 0,
        choice : 'none'
    }

    if (arguments.length > 0) {
        player.name = arguments[0];
    }

    return player;
}

$(window).on('unload', function() {
    database.ref(game.userPersona).remove();
});







/*
$(document).on('click', '.startBtn', function(event) {
    event.preventDefault();

    let id = $(this).attr('id');
});

function newPlayer1() {
    database.ref().update({
        player1 : {
            wins : 0,
            losses : 0,
            choice : 'none'
        }
    })
}

function newPlayer2() {
    database.ref().update({
        player2 : {
            wins : 0,
            losses : 0,
            choice : 'none'
        }
    })
}



function setName(whichPlayer, name) {
    database.ref().child(whichPlayer).update({
        name : name
    })
}

/*
When people leave the game:

$(window).unload(function() {...})
*/