import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = this.game.height - this.height - this.game.groundMargin;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimmer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];

    }
    update(input, deltaTime) {
        this.checkCollisions();
        this.currentState.handle(input);
        // horizontal movement
        this.x += this.speed;
       if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
       else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
       else this.speed = 0;
       // horizontal boundaries
       if (this.x < 0) this.x = 0;
       if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

       // vertical movement
      //  if (input.includes('ArrowUp') && this.onGround()) this.vy -= 30;
       this.y += this.vy;
       if (!this.onGround()) this.vy += this.weight;
       else this.vy = 0;
        // vertical boundaries
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
       // sprite animation
       if(this.frameTimmer > this.frameInterval) {
        this.frameTimmer = 0;
        if (this.frameX < this.maxFrame) this.frameX++;
         else this.frameX = 0;
       } else {
        this.frameTimmer += deltaTime;
       }
       
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollisions() {
        this.game.enemies.forEach(enemy => {
            if(enemy.x < this.x + this.width && 
                enemy.x + enemy.width > this.x && 
                enemy.y < this.y + this.height && 
                enemy.y + enemy.height > this.y) {
                // collision detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                this.game.score++;
                if (this.markedForDeletion === this.states[4] || this.currentState === this.states[5]) {
                    
                }   else {
                    this.setState(6, 0);
                }
            } 
           

        });
    }
}