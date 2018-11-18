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
    player1 : {
        name : '',
        wins : 0,
        losses : 0,
        choice : 'none'
    },

    player2 : {
        name : '',
        wins : 0,
        losses : 0,
        choice : 'none'  
    },

    userPersona : 'Spectator',
    theme : 1
}

database.ref().on("value", function(snapshot) {
    let p1 = snapshot.val().player1;
    let p2 = snapshot.val().player2;

    /*
    Check if names are in database
    if p1/p2 is in, change p1/p2 column appropriately
        Needs to say "waiting for other player"
        or something similar. Will only display
        actual game when BOTH players are in game
    */

    game.player1.name = p1.name;
    game.player1.wins = p1.wins;
    game.player1.losses = p1.losses;
    game.player1.choice = p1.choice;

    game.player2.name = p2.name;
    game.player2.wins = p2.wins;
    game.player2.losses = p2.losses;
    game.player2.choice = p2.choice;

    /*
    with these values stored, update columns respectively
    This should be done in a separate function so that it can also
    be called with the "click" function for the form submit
    */
});

function updateColumn(num) {
    let id = `p${num}Content`;
    $('#'+id).empty();
    // if column is sign in screen, change to game screen

    // if column is game screen, change to sign in screen
}

// Changes selected column to Name Input display
function createNameInput(num) {
    let id = `p${num}Content`;
    let content = $('#'+id);
    content.empty();

    content.html(
        '<form class="form-group">'
        +   '<label for="nameInput">'
        +       '<h3>Input your name!</h3>'
        +   '</label>'
        +   '<input type="text" class="form-control" id="nameInput' + num + '" placeholder="Dan Smith">'
        +   '<button type="submit" class="btn btn-primary startBtn" id="startPlayer' + num + '">Play!</button>'
        +'</form>'
    );
}

// Changes selected column to Gameplay display
function createGameScreen(num) {
    let id = `p${num}Content`;
    let content = $('#'+id);
    content.empty();

    content.html(
        // create html for game screen
    )
}














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