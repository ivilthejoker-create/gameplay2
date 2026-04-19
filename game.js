// 1. إدارة النقاط كأوبجكت (Score Object)
let ScoreManager = {
    current: 0,
    high: localStorage.getItem('high_score') || 0,
    add: function(points) { this.current += points; },
    reset: function() {
        if (this.current > this.high) {
            this.high = this.current;
            localStorage.setItem('high_score', this.high);
        }
        this.current = 0;
    }
};

let player, enemies, cursors, scoreText;
let isPremium = localStorage.getItem('game_key') === 'SECRET123'; 
let spawnTimer; // متغير للتحكم في سرعة ظهور الأعداء

const config = {
    type: Phaser.AUTO,
    width: 1000, height: 800,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // روابط مباشرة تعمل فوراً
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');       
}

function create() {
    this.add.image(500, 400, 'background').setcale(1.5);

    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' 
    });

    player = this.physics.add.sprite(500, 700, 'player');
    player.setCollideWorldBounds(true);
    
    if (isPremium) {
        player.setTint(0x00ff00); 
    }

    enemies = this.physics.add.group();
    
    // إعداد المؤقت الأولي لظهور الأعداء
    spawnTimer = this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(player, enemies, () => {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(ScoreManager.current / 10));
        ScoreManager.reset();
        this.scene.restart();
    });
}

function spawnEnemy() {
    let x = Phaser.Math.Between(50, 950);
    let enemy = enemies.create(x, -50, 'enemy');
    
    // زيادة سرعة سقوط الأعداء بناءً على النقاط (الصعوبة)
    let currentScore = Math.floor(ScoreManager.current / 10);
    let extraSpeed = Math.min(currentScore, 400); // سرعة إضافية تصل لـ 400
    enemy.setVelocityY(200 + Math.min(Math.floor(ScoreManager.current / 10), 500)). 
}

function update() {
    let speed = isPremium ? 600 : 400;

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    ScoreManager.add(1);
    let displayScore = Math.floor(ScoreManager.current / 10);
    scoreText.setText('النقاط: ' + displayScore);

    // زيادة وتيرة ظهور الأعداء (صعوبة إضافية كل 100 نقطة)
    if (displayScore > 0 && displayScore % 100 === 0) {
        if (spawnTimer.delay > 300) { // الحد الأدنى للتأخير هو 300ms
            spawnTimer.delay -= 2; 
        }
    }

    if (displayScore >= 2000) {
        this.physics.pause();
        alert("أنت بطل حقيقي! فزت بأعلى صعوبة!");
        ScoreManager.reset();
        this.scene.restart();
    }
}
