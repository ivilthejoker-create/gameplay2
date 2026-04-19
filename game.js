// 1. إعداد كائن إدارة النقاط (Score Object)
let ScoreManager = {
    current: 0,
    high: localStorage.getItem('high_score') || 0,
    add: function(points) {
        this.current += points;
    },
    reset: function() {
        if (this.current > this.high) {
            this.high = this.current;
            localStorage.setItem('high_score', this.high);
        }
        this.current = 0;
    }
};

// 2. المتغيرات العامة
let player, enemies, cursors, scoreText;
let isPremium = localStorage.getItem('game_key') === 'SECRET123'; 

// 3. إعدادات المحرك
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

// 4. تحميل الموارد
function preload() {
    // تأكد من وجود هذه الملفات في مستودع GitHub الخاص بك بنفس الأسماء
    this.load.image('background', 'sky.png');    
    this.load.image('player', 'player.png');     
    this.load.image('enemy', 'enemy.png');       
}

// 5. بناء عالم اللعبة
function create() {
    // إضافة الخلفية أولاً (لتكون في الأسفل)
    this.add.image(400, 300, 'background');

    // إضافة كائن نص النقاط (scoreText Object) ليكون مرئياً فوق الخلفية
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontStyle: 'bold'
    });

    // إنشاء اللاعب وتفعيل الفيزياء
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    
    // تطبيق ميزات التميز (Premium)
    if (isPremium) {
        player.setTint(0x00ff00); // تغيير اللون للأخضر/الذهبي
        console.log("وضع التميز نشط: سرعة مضاعفة مفعلة.");
    }

    // مجموعة الأعداء
    enemies = this.physics.add.group();
    
    // مؤقت لتوليد الأعداء تلقائياً
    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // إعداد أزرار التحكم
    cursors = this.input.keyboard.createCursorKeys();

    // منطق التصادم (الخسارة)
    this.physics.add.overlap(player, enemies, () => {
        alert("انتهت اللعبة! نقاطك: " + Math.floor(ScoreManager.current / 10));
        ScoreManager.reset();
        this.scene.restart();
    });
}

// 6. وظيفة إنشاء الأعداء
function spawnEnemy() {
    let x = Phaser.Math.Between(50, 750);
    let enemy = enemies.create(x, -50, 'enemy');
    enemy.setVelocityY(200); // سرعة سقوط العدو لأسفل
}

// 7. التحديث المستمر (منطق اللعبة)
function update() {
    // تحديد السرعة بناءً على حالة التميز
    let speed = isPremium ? 550 : 300;

    // حركة اللاعب
    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث النقاط ككائن وعرضها على الشاشة
    ScoreManager.add(1);
    scoreText.setText('النقاط: ' + Math.floor(ScoreManager.current / 10));

    // هدف الفوز: عند الوصول لـ 500 نقطة
    if (Math.floor(ScoreManager.current / 10) >= 500) {
        this.physics.pause();
        player.setTint(0xffd700);
        alert("تهانينا! لقد حققت هدف الفوز!");
        ScoreManager.reset();
        this.scene.restart();
    }
}
