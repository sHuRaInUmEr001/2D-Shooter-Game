const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let player = { x: 50, y: 200, width: 30, height: 30, color: 'blue', speed: 5 };
let bullets = [];
let enemies = [];
let score = 0;

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && player.y > 0) player.y -= player.speed;
  if (e.key === 'ArrowDown' && player.y < canvas.height - player.height) player.y += player.speed;
  if (e.key === ' ') fireBullet();
});

// Fire a bullet
function fireBullet() {
  bullets.push({ x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 5, speed: 7 });
}

// Spawn an enemy
function spawnEnemy() {
  const y = Math.random() * (canvas.height - 30);
  enemies.push({ x: canvas.width, y: y, width: 30, height: 30, color: 'red', speed: 3 });
}

// Update game objects
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Update and draw bullets
  bullets = bullets.filter((bullet) => bullet.x < canvas.width);
  bullets.forEach((bullet) => {
    bullet.x += bullet.speed;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Update and draw enemies
  enemies = enemies.filter((enemy) => enemy.x + enemy.width > 0);
  enemies.forEach((enemy) => {
    enemy.x -= enemy.speed;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Check collision with player
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      alert('Game Over! Your score: ' + score);
      document.location.reload();
    }
  });

  // Check bullet-enemy collisions
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        score++;
        enemies.splice(eIndex, 1);
        bullets.splice(bIndex, 1);
      }
    });
  });

  // Update score
  document.getElementById('score').textContent = score;
}

// Game loop
function gameLoop() {
  updateGame();
  requestAnimationFrame(gameLoop);
}

// Start game
setInterval(spawnEnemy, 1000);
gameLoop();
