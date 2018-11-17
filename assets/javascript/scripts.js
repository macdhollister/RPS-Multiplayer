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

let game = {
    player1 : {
        wins : 0,
        losses : 0,
        name : "empty",
        choice: "none"
    },
    player2 : {
        wins : 0,
        losses : 0,
        name : "empty",
        choice: "none"
    },
    activeUser : "null",
    turn : 1
}

database.ref().on("value", function(data) {
    
    // Setting up players
        // if       no player 1 --> set user to player 1
        // else if  no player 2 --> set user to player 2
        // else                 --> set user to spectator

    
})





/*
When people leave the game:

$(window).unload(function() {...})
*/