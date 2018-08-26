/*
 *  Script for the hangman game.
 */

var winningSound, losingSound;
var newGameButton;
var answerDisplay;

/**********************************************************  
        Object representing the Hangman game
 **********************************************************/
 var hangman =  
 {
   // List of words to guess - these are X-MEN characters
   wordList : ['wolverine',
               'cyclops',
               'iceman',
               'professorx',
               'magneto',
               'mystique',
               'storm',
               'colossus',
               'nightcrawler',
               'psylocke',
               'phoenix',
               'beast',
               'pyro',
               'apocalypse',
               'gambit',
               'rogue',
               'mystique'],
    wins    : 0,
    losses  : 0,

    // This is an object within the main hangman object.
    // It represents the current game being played
    currentGame : 
    {
      wordToGuess       : '',
      lettersGuessed    : new Set(),
      numLettersGuessed : 0,
      chancesLeft : 0,
      over : false,
    },

    // This is what gets displayed on the browser. 
    // Initially it is set to all-blanks. 
    // The number of blanks equals the length of the word to guess.
    displayed : "",

    // Winning sound
    winningSound : null,

    // This function initializes a new game
    newGame:function()
    {
      var currentGame = this.currentGame;
      var randomIndex = 0;
      var randomSeed = this.wordList.length;

      // Initialize chances left and letters guessed
      currentGame.chancesLeft = 10;
      currentGame.lettersGuessed.clear();
      currentGame.numLettersGuessed = 0;
      currentGame.over = false;

      // re-initialize the displayed string
      this.displayed = "";

      // Hide new game button until the current game is over
      newGameButton.style.visibility = "hidden";

      // Hide the answer display div until the game is over
      answerDisplay.style.display = "none";

      // Choose a random word from the word list. 
      // Make sure the index is within the bounds of the wordList array.
      do{
        randomIndex = Math.floor(Math.random() * Math.floor(randomSeed));
      }while(randomIndex >= this.wordList.length);

      currentGame.wordToGuess = this.wordList[randomIndex];

      //console.log("The world to guess is "+currentGame.wordToGuess);

      // Space-separate the blanks
      for(var i = 0; i < currentGame.wordToGuess.length - 1; i++)
      {
        this.displayed += "_ ";
      }
      this.displayed += "_";

      // DEBUGGING: Print to console REMOVETHIS
      console.log(this.displayed);

      // Initially, set the displayed word to all-blanks
      document.getElementById("displayed_word").textContent = this.displayed;
      document.getElementById("guesses_remaining").textContent = currentGame.chancesLeft;
    }
 };
 var currentGame = hangman.currentGame;
 var guessed = currentGame.lettersGuessed;

// This helper function replaces a character in the string
// at the specified index 
function setCharAt(str, index, chr) 
{
  if(index > str.length-1)
  {
    return str;
  }
  else if(index == length -1)
  {
    str[index] = chr;
    return str;
  }

  return str.substr(0,index) + chr + str.substr(index+1);
}
 
/************************************************
       MAIN EVENT HANDLER FOR THE GAME          
*************************************************/
 document.onkeyup = function(event)
 {
   var currentWord = currentGame.wordToGuess;
   var currentWordLength = currentWord.length;
   var currentGuess = event.key;

   var occurrence = 0;
   var currentIndex = 0;
   var numOccurrences = 0;
   var letterAlreadyGuessed = false;

   //console.log("User pressed "+ currentGuess);
   if(true == currentGame.over){
     return;
   }

   // Check if the letter has been guessed already
   if(false !== guessed.has(currentGuess))
   {
     letterAlreadyGuessed = true;
     console.log("You already guessed "+currentGuess);
     return;
   }
   else
   {
     /* Check if the letter guessed is present in the word */
     while(currentIndex < currentWordLength)
     {
       occurrence = currentWord.indexOf(currentGuess,currentIndex);
       if(-1 == occurrence)
       {
         break;
       }
       else
       {
         //console.log("Letter "+currentGuess+" occurred at index"+occurrence);
         hangman.displayed = setCharAt(hangman.displayed, 2* occurrence, currentGuess.toUpperCase());
         console.log("current status ="+hangman.displayed);
         document.getElementById("displayed_word").textContent = hangman.displayed;
         numOccurrences += 1;
         currentIndex = occurrence + 1;
         guessed.add(currentGuess);
       }
     }
   }

   if(0 == numOccurrences) // Letter isn't present in the word
   {
     console.log("Oops - letter "+currentGuess+" isn't present");
     currentGame.chancesLeft -= 1;

     if(0 == currentGame.chancesLeft)  // No chances left - player loses
     {
       hangman.losses += 1;
       document.getElementById("Losses").textContent = hangman.losses;
       losingSound.play();
       currentGame.over = true;

       answerDisplay.textContent = "Sorry, the answer was "+currentGame.wordToGuess.toUpperCase();
       answerDisplay.style.display = "block";

       // Show the new game button so that user can play a new game
       newGameButton.style.visibility = "visible";
     }
     else // Still in the game, just decrease remaining chances by 1
     {
       console.log("You have "+currentGame.chancesLeft+" chances left");
     }
     document.getElementById("guesses_remaining").textContent = currentGame.chancesLeft;
   }
   else if(true === letterAlreadyGuessed) // Letter already guessed
   {
     console.log("You already guessed "+currentGuess); 
   }
   else // Good guess - the letter is present in the word, one step closer
   {
     currentGame.numLettersGuessed += numOccurrences;
     if(currentWordLength == currentGame.numLettersGuessed) // Guessed all letters
     {
       console.log("You guessed it !!!");
       hangman.wins += 1;
       document.getElementById("Wins").textContent = hangman.wins;
       winningSound.play();       
       currentGame.over = true;

       // Show the answer-display div
       answerDisplay.textContent = "You guessed it !! The answer is "+currentGame.wordToGuess.toUpperCase();
       answerDisplay.style.display = "block";
        
       // Show the new game button so that user can play a new game
       newGameButton.style.visibility = "visible";
     }
   }
 }

 // on-click handler for new game button
function newGameClicked(){
  hangman.newGame();
}
 
 // Initialize the Hangman page - wins, losses and start a new game
 window.onload = function(){
  // Audio effects
  // ta-da!! - when the user guesses correctly
  winningSound = document.createElement("audio");
  winningSound.setAttribute("src", "assets/sounds/ta-da.mp3");

  // sad trombone - when the user runs out of chances
  losingSound = document.createElement("audio");
  losingSound.setAttribute("src", "assets/sounds/sad.mp3");

  // Get new game button
  newGameButton = document.getElementById("new-game-btn");

  // Get the answer display div
  answerDisplay = document.getElementById("answer-display");

  // Initialize wins and losses and start new game
  hangman.wins = 0;
  hangman.losses = 0;
  hangman.newGame();
}


