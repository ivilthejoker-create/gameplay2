// 1. كائن إدارة النقاط (Score Object)
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

const config = {
    type: Phaser.AUTO,
    width: 800, height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // العودة للروابط المباشرة لضمان عدم ظهور "التيكستر"
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');       
}

function create() {
    // وضع الخلفية أولاً لضمان ظهور النص فوقها
    this.add.image(400, 300, 'background');

    // كائن النص لعرض السكور
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' 
    });

    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    
    if (isPremium) {
        player.setTint(0x00ff00); // ميزة البريميوم (تغيير اللون)
    }

    enemies = this.physics.add.group();
    
    // توليد عدو كل ثانية
    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    // منطق التصادم
    this.physics.add.overlap(player, enemies, () => {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(ScoreManager.current / 10));
        ScoreManager.reset();
        this.scene.restart();
    });
}

function spawnEnemy() {
    let x = Phaser.Math.Between(50, 750);
    let enemy = enemies.create(x, -50, 'enemy');
    enemy.setVelocityY(200);
}

function update() {
    let speed = isPremium ? 550 : 300;

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث النقاط كأوبجكت
    ScoreManager.add(1);
    scoreText.setText('النقاط: ' + Math.floor(ScoreManager.current / 10));

    // هدف الفوز عند 1000 نقطة
    if (Math.floor(ScoreManager.current / 10) >= 1000) {
        this.physics.pause();
        alert("مبروك! لقد حققت هدف الـ 1000 نقطة وفزت!");
        ScoreManager.reset();
        this.scene.restart();
    }
}
