import HostileEntity from '../HostileEnemy.js';
import BoundingBox from '../BoundingBox.js';
import Animation from '../Animation.js';

class Skeleton extends HostileEntity {
    constructor(game, x, y) {
        super(game, x, y);
        this.boundingBox = new BoundingBox(x, y, 30, 50, 0, 7.5);
        this.animWalkLeft = new Animation(this.game.assetManager.getAsset('skeleton.walk.left'), 0, 0, 44, 66, 0.1, 13, true, false);
        this.animWalkRight = new Animation(this.game.assetManager.getAsset('skeleton.walk.right'), 0, 0, 44, 66, 0.1, 13, true, false);
        this.animDeath = null;
        this.animation = this.animWalkRight;
        this.cooldown = 0;
        this.moveSpeed = 70;
        this.attackDamage = 20;
        this.attackInterval = 1;
        this.attackRange = 40;
        this.followRange = 200;
        this.maxHealth = 60;
        this.health = 60;
    }

    update() {
        super.update();

        if (!this.alive) {
            if (this.animDeath && this.animation == this.animDeath) {
                this.life -= this.game.clockTick;
                if (this.life <= 0) this.destroyed = true;
            } else {
                this.destroyed = true;
            }

            return;
        }

        let player = this.game.level.getEntityWithTag('Player');

        if (player) {
            if (this.cooldown > 0) this.cooldown = Math.max(this.cooldown - this.game.clockTick, 0);
            let xOrigC = (player.x + player.animation.frameWidth / 2);
            let yOrigC = (player.y + player.animation.frameHeight / 2);
            let xOrigS = this.boundingBox.origin.x;
            let yOrigS = this.boundingBox.origin.y;
            let xDiff = xOrigC - xOrigS;
            let yDiff = yOrigC - yOrigS;
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

            if (distance > this.detectRange || !this.checkSight(player.boundingBox)) {
                return;
            }

            if (this.attackRange <= distance && distance <= this.followRange) {
                this.xMot = this.game.clockTick * (this.moveSpeed * xDiff) / distance;
                this.yMot = this.game.clockTick * (this.moveSpeed * yDiff) / distance;
            }

            this.updatePosition(this.boundingBox);

            if (distance <= this.attackRange) {
                this.attack(xDiff, yDiff, distance, xOrigS, yOrigS);
            } else {
                if (this.direction == 'left') {
                    this.animation = this.animWalkLeft;
                } else {
                    this.animation = this.animWalkRight;
                }
            }
        }
    }

    attack() {
        if (this.cooldown == 0) {
            let player = this.game.level.getEntityWithTag('Player');

            if (this.direction == 'left') {
                this.animation = this.animWalkLeft;
            } else {
                this.animation = this.animWalkRight;
            }

            player.damage(this.attackDamage);

            this.cooldown = this.attackInterval;
        }
    }

    updatePosition(collider = this.boundingBox) {
        super.updatePosition(collider);

        if (this.xMot < 0) this.direction = 'left';
        else if (this.xMot > 0) this.direction = 'right';
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

        super.draw(ctx);
    }
}

export default Skeleton;