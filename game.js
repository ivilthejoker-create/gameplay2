// 1. نظام النقاط (Score)
let ScoreManager = {
    current: 0,
    add: function(points) { this.current += points; },
    reset: function() { this.current = 0; }
};

let player, enemies, cursors, scoreText;

const config = {
    type: Phaser.AUTO,
    width: 1000, 
    height: 800,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // روابط الصور المباشرة
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');       
}

function create() {
    // الخلفية مصممة لتناسب مساحة 1000x800
    this.add.image(500, 400, 'background').setScale(1.5);

    // عرض النقاط في الزاوية
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' 
    });

    // إنشاء اللاعب في منتصف الساحة
    player = this.physics.add.sprite(500, 400, 'player');
    player.setCollideWorldBounds(true);
    player.setDepth(1); 

    enemies = this.physics.add.group();
    
    // ظهور الأعداء بمعدل ثابت (كل ثانية عدو واحد)
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
    // ظهور العدو في مكان عشوائي على عرض الساحة
    let x = Phaser.Math.Between(50, 950);
    let enemy = enemies.create(x, -50, 'enemy');
    enemy.setDepth(1);
    enemy.setVelocityY(250); // سرعة ثابتة للأعداء (تم إلغاء الصعوبة)
}

function update() {
    let speed = 400; // سرعة ثابتة للاعب

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث السكور بشكل مستمر
    ScoreManager.add(1);
    scoreText.setText('النقاط: ' + Math.floor(ScoreManager.current / 10));
}
