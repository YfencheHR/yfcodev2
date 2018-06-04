
// Demonstración de múltiples fuerzas acutando en
// cuerpos (con clase Mover)
// cuerpos sujetos continuamente a gravedad
// cuerpos sujetos a resistencia de fluidos cuando están en el "agua"

// Cinco cuerpos en movimiento
var movers = [];
var nubes = [];
// Líquido

var widthP;
var heightP;
var imagenes =  {
    logo: "assets/img/logo.png",
    nube: "assets/img/nube2.png"
};
var logo;
var nube;
var liquid;
var totalIdeas = 5;

var controlEscena = 'inicio';

function setup() {
    widthP = document.getElementById('sketch-holder').offsetWidth;
    heightP = document.getElementById('sketch-holder').offsetHeight;
    var canvas = createCanvas(widthP, heightP);
    reset();
    canvas.parent('sketch-holder');
    // Crear objeto líquido
    logo = loadImage(imagenes.logo);
    nube = loadImage(imagenes.nube);
    liquid = new Liquid(0, height/2, width, height/2, 0.1);
}

function draw() {
    background(200);
    // Dibujar el agua
    liquid.display();

    for (var i = 0; i < totalIdeas; i++) {

        if (controlEscena === 'inicio') {
            escenaIncio(i);
        }

    }

}

function escenaIncio(i) {
    // ¿Está el objeto Mover dentro del objeto líquido?
    if (liquid.contains(movers[i])) {
        // Calcular fuerza de arrastre
        var dragForce = liquid.calculateDrag(movers[i]);
        // Aplicar fuerza de arrastre a Mover
        movers[i].applyForce(dragForce);
    }

    // Aquí se escala la gravedad según la masa
    var gravity = createVector(0, 0.1*movers[i].mass);
    // Aplicar gravedad
    movers[i].applyForce(gravity);

    // Refrescar y mostrar
    movers[i].update();
    movers[i].display();
    nubes[i].display();
    movers[i].checkEdges();

}

function mousePressed() {
    reset();
}

// Reiniciar todos los objetos Mover aleatoriamente
function reset() {
    var multiplicador = widthP / totalIdeas;
    var m = 0;
    var x = 0;
    var y = 0;
    for (var i = 0; i < totalIdeas; i++) {
        m = random(2.5, 5);
        x = 40+i*multiplicador;
        y = random(0, (height/2) - (height/2)/5);
        movers[i] = new Mover(m, x, y);
        nubes[i] = new Nube(m, x, y);
    }
}

var Nube = function(m, x, y) {
    this.mass = m;
    this.x = x;
    this.y = y;
};

Nube.prototype.display = function() {
    /*stroke(0);
    strokeWeight(2);
    fill(255,127);*/
    image(nube, this.x,this.y,this.mass*16,this.mass*16);
    //ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
};

var Liquid = function(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
};

// ¿Está el objeto Mover dentro del objeto líquido?
Liquid.prototype.contains = function(m) {
    var l = m.position;
    return l.x > this.x && l.x < this.x + this.w &&
        l.y > this.y && l.y < this.y + this.h;
};

// Calcular fuerza de arrastre
Liquid.prototype.calculateDrag = function(m) {
    // Magnitud es coeficiente * velocidad al cuadrado
    var speed = m.velocity.mag();
    var dragMagnitude = this.c * speed * speed;

    // Dirección es el inverso de la velocidad
    var dragForce = m.velocity.copy();
    dragForce.mult(-1);

    // Escalar según magnitud
    // dragForce.setMag(dragMagnitude);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
};

Liquid.prototype.display = function() {
    noStroke();
    fill(50);
    rect(this.x, this.y, this.w, this.h);
};

function Mover(m,x,y) {
    this.mass = m;
    this.position = createVector(x,y);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
}

// Segunda ley de Newton: F = M * A
// ó A = F / M
Mover.prototype.applyForce = function(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
};

Mover.prototype.update = function() {
    // La velocidad es cambiada según la aceleración
    this.velocity.add(this.acceleration);
    // La posición es cambiada según la velocidad
    this.position.add(this.velocity);
    // Borrar aceleración en cada cuadro
    this.acceleration.mult(0);
};

Mover.prototype.display = function() {
    /*stroke(0);
    strokeWeight(2);
    fill(255,127);*/
    image(logo, this.position.x,this.position.y,this.mass*16,this.mass*16);
    //ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
};

// Rebotar contra la parte inferior de la ventana
Mover.prototype.checkEdges = function() {
    if (this.position.y > (height - this.mass*8)) {
        // Un poco de amortiguamiento al rebotar contra el fondo
        this.velocity.y *= -0.9;
        this.position.y = (height - this.mass*8);
    }
};