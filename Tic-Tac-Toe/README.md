# Tic Tac Toe Game

## Overview
This is a modern implementation of the classic Tic Tac Toe game, designed with HTML, CSS, and JavaScript. It provides a visually appealing and user-friendly interface with features such as score tracking, turn indication, and game reset options.

## Features

- **Player Turns**: Players alternate between "X" and "O".
- **Score Tracking**: Displays and updates the score for both players.
- **Game Reset**: Allows players to start a new game or reset the scores.
- **Winning and Draw Detection**: Detects when a player wins or when there is a draw, and displays appropriate messages.
- **Mobile Responsiveness**: The game layout is responsive and adjusts for smaller screen sizes.

## Mechanics

### Game Flow

1. **Game Setup**:
   - The game board is a 3x3 grid of cells.
   - Players take turns to place their mark ("X" or "O") on the grid.
   - Player "X" always goes first.

2. **Turns**:
   - The game alternates between players "X" and "O".
   - The current player's turn is indicated at the top of the screen.
   - The game board cells are clickable, and each player can place their mark in any empty cell.
   - Once a player places their mark, the turn switches to the other player.

3. **Winning Conditions**:
   - A player wins if they place three of their marks in a row, either horizontally, vertically, or diagonally.
   - Once a player wins, their name is highlighted, and the board is disabled to prevent further moves.
   - The score for the winning player is updated.

4. **Draw**:
   - If all cells are filled and no player has won, the game results in a draw.
   - The game displays a message indicating that it’s a draw, and no player’s score is updated.

5. **Game Reset**:
   - Players can reset the game using the "New Game" button, which clears the board and starts a fresh game with the same score.
   - The "Reset Score" button clears both the board and resets the players' scores.

6. **Scoreboard**:
   - Scores are displayed next to the players' names.
   - Player "X" and player "O" scores are displayed in their respective sections.
   - The score can be reset using the "Reset Score" button.

### Game Reset Button

- The **"New Game"** button resets the game board but keeps the score intact.
- The **"Reset Score"** button resets both the game board and the scores to zero.

### Winning Animation

- When a player wins, the winning cells are highlighted with a glowing effect and a smooth animation to emphasize the victory.
- The game also displays a message with the winner's name.

## How to Play

1. Open the game in your browser.
2. Player "X" goes first. Click on any empty cell to place your mark.
3. Alternate turns between players "X" and "O" by clicking on the cells.
4. If a player wins, their score is updated, and the game ends. The game will announce the winner.
5. To start a new game or reset the score, use the provided buttons.

## Technologies Used

- **HTML**: Structure of the game board and user interface.
- **CSS**: Styling and animations for the game.
- **JavaScript**: Game logic, including turn handling, winning condition checks, score tracking, and reset functionality.

## Code Explanation

### Key Variables

- **board**: An array of length 9, representing the 3x3 grid of cells. Each element in the array corresponds to a cell on the board.
- **isXTurn**: A boolean variable that tracks whether it's Player X's turn or not.
- **xScore and oScore**: Variables that store the scores for Player X and Player O, respectively.

### Functions

- **initializeBoard()**: Creates the game board by dynamically generating the cells.
- **updateTurnIndicator()**: Updates the turn indicator and player status based on the current player’s turn.
- **handleCellClick(e)**: Handles the logic when a player clicks on a cell, places their mark, and checks for a winner or draw.
- **checkWinner(player)**: Checks whether the given player has won the game by matching their marks in any of the winning combinations.
- **highlightWinner(player)**: Highlights the winning cells and disables further moves after a win.
- **updateScore(player)**: Updates the score for the player who won.
- **resetGame()**: Resets the game state, including the board and turn indicator.
- **resetScores()**: Resets the scores of both players to zero.

## Setup Instructions

1. Copy the HTML, CSS, and JavaScript code into three separate files: `index.html`, `style.css`, and `script.js`.
2. Open the `index.html` file in any modern web browser to play the game.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

