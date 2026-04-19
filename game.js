// 1. نظام النقاط البسيط
var Score = 0;
var player, enemies, cursors, scoreText;

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

function preload() {
    // تحميل الصور فقط (حذفنا روابط الصوت تماماً لتجنب خطأ CORS و 404)
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');       
}

function create() {
    // إضافة الخلفية وتوسيعها
    this.add.image(500, 400, 'background').setScale(1.5);

    // إضافة نص النقاط
    scoreText = this.add.text(20, 20, 'النقاط: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontStyle: 'bold'
    });

    // إنشاء اللاعب في منتصف أسفل الشاشة
    player = this.physics.add.sprite(500, 700, 'player');
    player.setCollideWorldBounds(true);
    player.setDepth(10); // لضمان ظهوره فوق الخلفية

    enemies = this.physics.add.group();
    
    // ظهور الأعداء كل ثانية بمعدل ثابت
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

    // منطق الخسارة عند التصادم
    this.physics.add.overlap(player, enemies, function() {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(Score / 10));
        Score = 0;
        this.scene.restart();
    }, null, this);
}

function update() {
    var speed = 400;

    // التحكم في الحركة
    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث السكور
    Score += 1;
    scoreText.setText('النقاط: ' + Math.floor(Score / 10));
}
