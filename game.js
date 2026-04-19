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

// 2. كائن إدارة الصوت (Audio Object)
let AudioManager = {
    bgMusic: null,
    play: function() {
        if (this.bgMusic && !this.bgMusic.isPlaying) {
            this.bgMusic.play({ loop: true, volume: 0.5 });
        }
    },
    stop: function() {
        if (this.bgMusic) this.bgMusic.stop();
    }
};

let player, enemies, cursors, scoreText, spawnTimer;
let isPremium = localStorage.getItem('game_key') === 'SECRET123'; 

const config = {
    type: Phaser.AUTO,
    width: 1000, // عرض الساحة الجديد
    height: 800, // طول الساحة الجديد
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // تحميل الصور من الروابط المباشرة
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');    
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-ship.png');     
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/slime.png');
    // تحميل ملف الصوت
    this.load.audio('space_theme', 'https://labs.phaser.io/assets/audio/SoundEffects/Pounder.mp3');
}

function create() {
    // إضافة وتوسيع الخلفية لتناسب الساحة الكبيرة
    this.add.image(500, 400, 'background').setScale(1.5);

    // عرض النقاط
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' 
    });

    // إعداد كائن الصوت
    AudioManager.bgMusic = this.sound.add('space_theme');

    // إنشاء اللاعب وتوسيطه في الساحة الجديدة
    player = this.physics.add.sprite(500, 700, 'player');
    player.setCollideWorldBounds(true);
    
    // ميزة التميز (تغيير اللون)
    if (isPremium) {
        player.setTint(0x00ff00); 
    }

    enemies = this.physics.add.group();
    
    // مؤقت ظهور الأعداء
    spawnTimer = this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    // منطق التصادم
    this.physics.add.overlap(player, enemies, () => {
        AudioManager.stop();
        alert("انتهت اللعبة! نقاطك: " + Math.floor(ScoreManager.current / 10));
        ScoreManager.reset();
        this.scene.restart();
    });
}

function spawnEnemy() {
    // جعل الأعداء يظهرون على كامل عرض الساحة الجديدة
    let x = Phaser.Math.Between(50, 950);
    let enemy = enemies.create(x, -50, 'enemy');
    
    // زيادة سرعة الأعداء تدريجياً مع زيادة النقاط (صعوبة تصاعدية)
    let currentScore = Math.floor(ScoreManager.current / 10);
    let speedBoost = Math.min(currentScore, 500); 
    enemy.setVelocityY(200 + speedBoost); 
}

function update() {
    // تشغيل الموسيقى عند أول حركة للاعب لتجاوز قيود المتصفح
    if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
        AudioManager.play();
    }

    let speed = isPremium ? 600 : 400;

    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
    else player.setVelocityY(0);

    // تحديث النقاط
    ScoreManager.add(1);
    let displayScore = Math.floor(ScoreManager.current / 10);
    scoreText.setText('النقاط: ' + displayScore);

    // زيادة وتيرة ظهور الأعداء كل 100 نقطة لزيادة التحدي
    if (displayScore > 0 && displayScore % 100 === 0) {
        if (spawnTimer.delay > 300) {
            spawnTimer.delay -= 2; 
        }
    }

    // شرط الفوز الجديد
    if (displayScore >= 3000) {
        this.physics.pause();
        AudioManager.stop();
        alert("تهانينا! أنت أسطورة الفضاء، لقد فزت!");
        ScoreManager.reset();
        this.scene.restart();
    }
}
