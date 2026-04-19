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
    this.add.image(400, 300, 'background');

    // إنشاء كائن النص وإسناده للمتغير scoreText
    scoreText = this.add.text(16, 16, 'النقاط: 0', { 
        fontSize: '32px', 
        fill: '#ffffff',
        fontStyle: 'bold'
    });
    
    // تأكد من وضع السطر أعلاه بعد الخلفية مباشرة ليظهر "كأوبجيكت" مرئي
    // ... باقي كود اللاعب والأعداء
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
    // زيادة النقاط داخل الكائن
    ScoreManager.add(1); 

    // تحديث النص المرئي باستخدام ميثودsetText
    // نقسم على 10 ليكون العداد منطقياً
    scoreText.setText('النقاط: ' + Math.floor(ScoreManager.current / 10));
    
    // ... باقي كود الحركة
}
}
// تعريف كائن السكور
let ScoreManager = {
    current: 0,
    high: localStorage.getItem('high_score') || 0,
    
    // ميثود لإضافة نقاط
    add: function(points) {
        this.current += points;
    },
    
    // ميثود لإعادة التعيين عند الخسارة
    reset: function() {
        if (this.current > this.high) {
            this.high = this.current;
            localStorage.setItem('high_score', this.high);
        }
        this.current = 0;
    }
};

let scoreText; // هذا هو كائن النص (Object) الذي يعرض النقاط في Phaser
