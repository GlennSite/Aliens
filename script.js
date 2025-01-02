const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Variables
const player1 = { x: 50, y: canvas.height / 2 - 50, width: 20, height: 100, color: "blue", score: 10 };
const player2 = { x: canvas.width - 70, y: canvas.height / 2 - 50, width: 20, height: 100, color: "red", score: 10 };
const balls = [];
let isGameOver = false;

// Create Balls
function createBall() {
  balls.push({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: Math.random() * 4 - 2,
    vy: Math.random() * 4 - 2,
    radius: 10,
    color: "yellow",
  });
}

// Draw Players
function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw Ball
function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// Update Ball Position
function updateBalls() {
  balls.forEach((ball, index) => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce on walls
    if (ball.y <= 0 || ball.y >= canvas.height) ball.vy *= -1;

    // Detect collision with players
    if (
      ball.x - ball.radius < player1.x + player1.width &&
      ball.y > player1.y &&
      ball.y < player1.y + player1.height
    ) {
      ball.vx *= -1; // Bounce back
    } else if (
      ball.x + ball.radius > player2.x &&
      ball.y > player2.y &&
      ball.y < player2.y + player2.height
    ) {
      ball.vx *= -1; // Bounce back
    }

    // Detect if a ball scores
    if (ball.x <= 0) {
      player1.score--;
      updateScore();
      balls.splice(index, 1); // Remove the ball
      createBall(); // Create a new ball
    } else if (ball.x >= canvas.width) {
      player2.score--;
      updateScore();
      balls.splice(index, 1);
      createBall();
    }
  });
}

// Update Scores
function updateScore() {
  document.getElementById("player1-score").innerText = `Joueur 1 : ${player1.score}`;
  document.getElementById("player2-score").innerText = `Joueur 2 : ${player2.score}`;

  // Check for Game Over
  if (player1.score <= 0 || player2.score <= 0) {
    isGameOver = true;
    alert(player1.score <= 0 ? "Joueur 2 a gagné !" : "Joueur 1 a gagné !");
    document.location.reload();
  }
}

// Move Players
window.addEventListener("mousemove", (e) => {
  player1.y = e.clientY - player1.height / 2;
});

window.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  if (touch.clientX < canvas.width / 2) {
    player1.y = touch.clientY - player1.height / 2;
  } else {
    player2.y = touch.clientY - player2.height / 2;
  }
});

// Game Loop
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(player1);
  drawPlayer(player2);

  balls.forEach(drawBall);
  updateBalls();

  requestAnimationFrame(gameLoop);
}

// Initialize Game
createBall();
createBall(); // Add 2 balls to make it fun
gameLoop();
