// 1. إعدادات اللعبة الأساسية
var config = {
    type: Phaser.AUTO,
    width: 1000, 
    height: 800,
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 0 } } 
    },
    scene: { 
        preload: preload, 
        create: create, 
        update: update 
    }
};

var game = new Phaser.Game(config);
var player, enemies, cursors, scoreText;
var score = 0;

// 2. تحميل الصور فقط (بدون صوت لتجنب الأخطاء)
function preload() {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');       
}

// 3. إنشاء عناصر اللعبة
function create() {
    // الخلفية
    this.add.image(500, 400, 'background').setScale(1.5);

    // نص النقاط
    scoreText = this.add.text(20, 20, 'النقاط: 0', { 
        fontSize: '32px', 
        fill: '#ffffff' 
    });

    // إنشاء اللاعب
    player = this.physics.add.sprite(500, 700, 'player');
    player.setCollideWorldBounds(true);
    player.setDepth(10); 

    enemies = this.physics.add.group();
    
    // ظهور الأعداء بمعدل ثابت
    this.time.addEvent({
        delay: 1000,
        callback: function() {
            var x = Phaser.Math.Between(50, 950);
            var enemy = enemies.create(x, -50, 'enemy');
            enemy.setVelocityY(250);
            enemy.setDepth(10);
        },
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    // التصادم
    this.physics.add.overlap(player, enemies, function() {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(score / 10));
        score = 0;
        this.scene.restart();
    }, null, this);
}

// 4. التحديث المستمر
function update() {
    var speed = 450;

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث النقاط
    score += 1;
    scoreText.setText('النقاط: ' + Math.floor(score / 10));
}
