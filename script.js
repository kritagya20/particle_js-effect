const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // it returns an object containing bunch of properties related to canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray;

//get mouse position 
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// create particles
class Particle {
    constructor( x, y, directionX, directionY, size, color) {
       this.x = x;
       this.y = y;
       this.directionX = directionX;
       this.directionY = directionY;
       this.size = size;
       this.color = color; 
    }

    //method to draw individual particles
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8C5523';
        ctx.fill();
    }

    //check particle position, check mouse position, move the partiles, draw tha particles
    update(){
        //check if particles is still within canvas
        if(this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX;

        }
        if( this.y > canvas.height || this.y < 0 ) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.x - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        //pushing away the colliding particles
        if (distance < mouse.radius + this.size) {
            //pushing away the colliding particles
            if(mouse.x < this.x && this.y < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -=10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y+=10;
            }
            if (mouse.y > this.y && this.y > canvas.height - this.size * 10) {
                this.y-=10;
            }
        }
        //moving non colliding particles
        this.x += this.directionX;
        this.y += this.directionY;

        //draw particles
        this.draw();
    }
}

//create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i=0; i<numberOfParticles*2; i++) {
        let size = (Math.random()*5) +1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8C5523';
    
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}

//animation loop 
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for (let i=0; i<particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue =1;
    for( let a=0; a<particlesArray.length; a++) {
        for ( let b=a; b<particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle= 'rgba(140,85,31,'+ opacityValue + ')';
                ctx.strokeStyle = 'rgba(140,85,31,1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            
            }
        
        }
    }
}

// resize event 
window.addEventListener('resize', 
function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height/80) * (canvas.height/80));
});

//mouse out event 
window.addEventListener('mouseout', 
function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();
