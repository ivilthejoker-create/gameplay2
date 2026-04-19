// 1. كائن إدارة النقاط (Object)
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
    // حل مشكلة التيكستر: تأكد أن هذه الأسماء تطابق تماماً الملفات في GitHub
    // إذا كانت الصور في مجلد، يجب كتابة اسم المجلد (مثلاً assets/sky.png)
    this.load.image('background', 'sky.png');    
    this.load.image('player', 'player.png');     
    this.load.image('enemy', 'enemy.png');       
}

function create() {
    // ترتيب الطبقات: الخلفية أولاً ثم السكور ثم اللاعب
    this.add.image(400, 300, 'background');

    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' 
    });

    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    
    if (isPremium) {
        player.setTint(0x00ff00); // ميزة بريميوم
    }

    enemies = this.physics.add.group();
    
    this.time.addEvent({
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

    // تحديث الأوبجكت وعرضه
    ScoreManager.add(1);
    scoreText.setText('النقاط: ' + Math.floor(ScoreManager.current / 10));

    // الهدف النهائي: الفوز
    if (Math.floor(ScoreManager.current / 10) >= 1000) {
        this.physics.pause();
        alert("مبروك! أنت أسطورة، حققت 1000 نقطة!");
        ScoreManager.reset();
        this.scene.restart();
    }
}
