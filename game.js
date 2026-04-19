let player, enemies, cursors;
let score = 0;
let scoreText;
let isPremium = localStorage.getItem('game_key') === 'SECRET123'; 

const config = {
    type: Phaser.AUTO,
    width: 800, height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // تحميل الصور محلياً (تأكد من رفعها لـ GitHub بنفس الأسماء)
    this.load.image('background', 'sky.png');    
    this.load.image('player', 'player.png');     
    this.load.image('enemy', 'enemy.png');       
}

function create() {
    // 1. الخلفية أولاً لكي لا تغطي العناصر الأخرى
    this.add.image(400, 300, 'background');

    // 2. إظهار السكور (النقاط) - تم وضعه هنا ليظهر فوق الخلفية
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontStyle: 'bold'
    });

    // 3. إنشاء اللاعب
    player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    
    if (isPremium) {
        player.setTint(0x00ff00); // لون مميز للمشتركين
    }

    enemies = this.physics.add.group();
    
    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    // التصادم والخسارة
    this.physics.add.overlap(player, enemies, () => {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(score / 10));
        score = 0;
        this.scene.restart();
    });
}

function spawnEnemy() {
    let x = Phaser.Math.Between(50, 750);
    let enemy = enemies.create(x, -50, 'enemy');
    enemy.setVelocityY(200);
}

function update() {
    let speed = isPremium ? 500 : 300;

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث النقاط وهدف الفوز
    score += 1;
    scoreText.setText('النقاط: ' + Math.floor(score / 10));

    if (Math.floor(score / 10) >= 500) {
        this.physics.pause();
        player.setTint(0xffd700);
        alert("مبروك! لقد وصلت للهدف وفزت في اللعبة!");
        score = 0;
        this.scene.restart();
    }
}
