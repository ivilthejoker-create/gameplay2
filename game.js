let isPremium = localStorage.getItem('game_key') === 'SECRET123'; 

if (isPremium) {
    player.setTint(0x00ff00); // تغيير لون اللاعب للذهبي
    // أضف أسلحة أو سرعة مضاعفة
}

const config = {
    type: Phaser.AUTO,
    width: 800, height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload: preload, create: create, update: update }
};

let player, enemies, cursors;
const game = new Phaser.Game(config);

function preload() {
    // الخلفية: لون سادة أو رابط لصورة
    this.load.image('background', 'https://phaser.io');
    // اللاعب: مربع أزرق (كنائب عن الصورة)
    this.load.image('player', 'https://phaser.io');
    // الأعداء: مربع أحمر
    this.load.image('enemy', 'https://phaser.io');
}

function create() {
    this.add.image(400, 300, 'background');

    // صنع اللاعب
    player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    
    // صنع مجموعة الأعداء
    enemies = this.physics.add.group();
    
    // توليد عدو كل ثانية
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            let x = Phaser.Math.Between(0, 800);
            let enemy = enemies.create(x, 0, 'enemy');
            enemy.setVelocityY(200); // سرعة سقوط العدو
        },
        loop: true
    });

    // التحكم بالأسهم
    cursors = this.input.keyboard.createCursorKeys();

    // إذا لمس العدو اللاعب -> خسارة
    this.physics.add.overlap(player, enemies, () => {
        this.scene.restart();
        alert("انتهت اللعبة! اشترِ مفتاحاً لتجربة أسلحة أقوى");
    });
}

function update() {
    if (cursors.left.isDown) player.setVelocityX(-300);
    else if (cursors.right.isDown) player.setVelocityX(300);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-300);
    else if (cursors.down.isDown) player.setVelocityY(300);
    else player.setVelocityY(0);
}


