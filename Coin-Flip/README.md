# Coin Flip Challenge Game

### Overview
The **Coin Flip Challenge** is a competitive game where two players bet on the outcome of flipping multiple coins. Players will predict the outcome (Heads or Tails) for each coin, and points are awarded based on the correctness of their guesses. The game can use up to **3 coins** per round, and the goal is to accumulate more points than the opponent. The game ends when one player reaches a score of **5 or more correct predictions**.

---

## Game Mechanics

### 1. **Game Setup**
- **Players:** 2 players, named **Player 1** and **Player 2** by default.
- **Coin Count:** Players can choose how many coins to flip per round (1, 2, or 3 coins). This is chosen via a radio button.
- **Guessing:** Both players will guess if each coin will land on **Heads** or **Tails**.

### 2. **Gameplay Process**
- Upon starting the game, the players are prompted to enter their names. These can be changed during the game.
- The game begins with each player selecting a **Heads** or **Tails** guess for each coin.
- The coins are flipped, and their results are displayed.
- Points are awarded for each correct guess on the coin flip:
  - A point is awarded for each correct guess of Heads or Tails.
  - If both players guess the same and are correct, both get a point.
  - If both players guess incorrectly, no points are awarded.

### 3. **Scoring System**
- **Scoring per Coin Flip:**
  - Each coin flip can earn a player **1 point** if their guess is correct.
  - If both players guess correctly, both players earn **1 point** each.
  - If both players guess incorrectly, no points are awarded.

- **Winning Condition:**
  - The first player to score **5 or more points** wins the game.
  - The game will automatically disable the **Flip Coins** button once a player reaches 5 points.

### 4. **User Interface**
- **Left Side:** Player 1's name, score, and guess for each coin.
- **Right Side:** Player 2's name, score, and guess for each coin.
- **Center:** Animated coin flips showing Heads or Tails.

---

## Instructions

### 1. **Starting the Game**
- Enter Player 1 and Player 2’s names (optional).
- Select the number of coins to be used in the round (1, 2, or 3 coins) using the radio buttons.
- Click **Start Game** to begin.

### 2. **Playing the Game**
- Each player will select their guesses for each coin flip.
  - Player 1 and Player 2 each choose either **Heads** or **Tails** for each coin.
- After making their selections, click **Flip Coins** to begin the round.

### 3. **Coin Flip and Scoring**
- Each coin is flipped, and the result (Heads or Tails) is displayed in the center.
- Players will receive points for each correct guess.
  - A **point** is awarded to the player if their guess is correct.
  - The **current score** for both players is displayed below the coin flip results.

### 4. **Ending the Game**
- The game ends when a player reaches **5 points**.
- Once a player wins, the **Flip Coins** button will be disabled.
- You can restart the game by clicking **Restart Game**, which will reset the scores and allow players to enter new names.

---

## Example Game Flow

1. **Start Screen:**
   - Player 1 enters their name: "Alice"
   - Player 2 enters their name: "Bob"
   - Selects **2 coins** for the round.

2. **Gameplay Round 1:**
   - Player 1 guesses **Heads** for Coin 1 and **Tails** for Coin 2.
   - Player 2 guesses **Heads** for Coin 1 and **Heads** for Coin 2.
   - Coin 1 lands on **Heads**, Coin 2 lands on **Tails**.
   - Player 1 earns **2 points** (both guesses correct).
   - Player 2 earns **1 point** (correct guess on Coin 1).

3. **Round Progression:**
   - The game continues with additional rounds, players making their guesses and the coins being flipped.
   - The **scoreboard** updates with each round, and points are awarded based on the correctness of the guesses.

4. **Winning the Game:**
   - Player 1 scores **5 points** after the 3rd round and is declared the winner.
   - The **Flip Coins** button is disabled.

---

## Technology Used
- **HTML:** For the structure and layout of the game.
- **CSS:** For styling the game elements and responsive layout.
- **JavaScript:** For game logic, coin flipping, scoring, and managing gameplay flow.

---

