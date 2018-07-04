// Cinco cuerpos en movimiento
let cajas;
let nubes;
let snowflakes;
// Entorno
let logo;
let nube;
let liquid;

let widthP;
let heightP;

let frameCount = 0;
let segLength = 50;

let config = {
  cajas: {
    total: 5,
    fondo: 0
  },
  nubes: {
    total: 1
  },
  nieve: {
    total: 250
  }
};
let imagenes =  {
  logo: "assets/img/logo.png",
  nube: "assets/img/nube2.png",
  luna: "assets/img/nube2.png"
};

let controlEscena = 'inicio';

function setup() {
  widthP = document.getElementById('sketch-holder').offsetWidth;
  heightP = document.getElementById('sketch-holder').offsetHeight;
  let canvas = createCanvas(widthP, heightP);
  reset();
  canvas.parent('sketch-holder');
  // Crear objeto líquido
  logo = loadImage(imagenes.logo);
  nube = loadImage(imagenes.nube);
  liquid = new Liquid(0, height - height/3, width, height/3, 0.1);
}

function draw() {
  // mostrar entorno
  entorno();

  if (controlEscena === 'inicio') {
    animarCajas();
  } else if (controlEscena === 'escuchando'){

  }
  animarNubes();
  nieve();
}

function entorno() {
  // fondo
  background(200);
  // Dibujar el agua
  liquid.display();
}

function nieve() {

  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  if (snowflakes.length < config.nieve.total) {
    for (let i = 0; i < random(2); i++) {
      snowflakes.push(new Snowflake()); // append snowflake object
    }
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }

  frameCount++;
}

function animarNubes() {

  for (let nube of nubes) {
    if (nube.checkMouse()) {
      nube.move();
    }
    nube.display();
  }
}

function animarCajas(i) {

  for (let caja of cajas) {
    // ¿Está el objeto Mover dentro del objeto líquido?
    if (liquid.contains(caja)) {
      // Calcular fuerza de arrastre
      let dragForce = liquid.calculateDrag(caja);
      // Aplicar fuerza de arrastre a Mover
      caja.applyForce(dragForce);
    }

    // Aquí se escala la gravedad según la masa
    let gravity = createVector(0, 0.1 * caja.mass);
    // Aplicar gravedad
    caja.applyForce(gravity);

    // Refrescar y mostrar
    if (caja.checkRebote()) {
      caja.updateDown();
      caja.checkEdges();
    } else {
      caja.updateUp()
    }
    caja.display();

  }
}

function mousePressed() {
  reset();
}

// Reiniciar todos los objetos Mover aleatoriamente
function reset() {
  cajas = [];
  nubes = [];
  snowflakes = [];
  let multiplicador = widthP / config.cajas.total;
  let m = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < config.cajas.total; i++) {
    m = random(2.5, 5);
    x = 40 + i * multiplicador;
    y = random(0, (height/2) - (height/2) / 5);
    cajas.push(new Caja(m, x, y));
    nubes.push(new Nube(m + m, x, y));
  }
}

function Nube(m, x, y) {
  this.mass = m;
  this.x = x;
  this.y = y;
  this.volumen = this.mass *16;
  this.mitadVolumen = this.volumen /2;
  this.distancia = 0;

  this.speed = {
    ymin: -1,
    xmin: -1,
    ymax: 1,
    xmax: 1,
  };
  this.move = function() {

    if (mouseX > this.x+ this.mitadVolumen) {
      this.speed.xmin = -1 - (this.distancia/20);
      this.speed.xmax = 0;
    } else {
      this.speed.xmin = 0;
      this.speed.xmax = 1 + (this.distancia/20);;
    }
    if (mouseY > this.y + this.mitadVolumen) {
      this.speed.ymin = -1 - (this.distancia/20);;
      this.speed.ymax = 0;
    } else {
      this.speed.ymin = 0;
      this.speed.ymax = 1 +  (this.distancia/20);
    }

    if (this.x > 0) {
      this.x += random(this.speed.xmin, this.speed.xmax);
    }
    if (this.y > 0) {
      this.y += random(this.speed.ymin, this.speed.ymax);
    }
  };
  this.checkMouse = function() {

    this.distancia = dist(mouseX, mouseY, this.x + this.mitadVolumen, this.y + this.mitadVolumen);
    if (this.distancia < this.mitadVolumen) {
      return true;
    }
    return false;

  };
  this.display = function() {
     image(nube, this.x,this.y,this.volumen,this.volumen);
  };
}

function Liquid(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  // ¿Está el objeto Mover dentro del objeto líquido?
  this.contains = function(m) {
    let l = m.position;
    return l.x > this.x && l.x < this.x + this.w &&
      l.y > this.y && l.y < this.y + this.h;
  };
  // Calcular fuerza de arrastre
  this.calculateDrag = function(m) {
    // Magnitud es coeficiente * velocidad al cuadrado
    let speed = m.velocity.mag();
    let dragMagnitude = this.c * speed * speed;

    // Dirección es el inverso de la velocidad
    let dragForce = m.velocity.copy();
    dragForce.mult(-1);

    // Escalar según magnitud
    // dragForce.setMag(dragMagnitude);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
  };

  this.display = function() {
    noStroke();
    fill(50);
    rect(this.x, this.y, this.w, this.h);
  };
}

function Caja(m,x,y) {
  this.mass = m;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);
  this.cotadorRebotes = 0;
  this.maxRebotes = 30;
  // Segunda ley de Newton: F = M * A
  // ó A = F / M
  this.applyForce = function(force) {
    let f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  };
  this.checkRebote = function() {
    return this.cotadorRebotes !== this.maxRebotes;
  };
  this.updateDown = function() {
    // La velocidad es cambiada según la aceleración
    this.velocity.add(this.acceleration);
    // La posición es cambiada según la velocidad
    this.position.add(this.velocity);
    // Borrar aceleración en cada cuadro
    this.acceleration.mult(0);
  };
  this.updateUp = function() {
  };
  this.updateDown = function() {
    // La velocidad es cambiada según la aceleración
    this.velocity.add(this.acceleration);
    // La posición es cambiada según la velocidad
    this.position.add(this.velocity);
    // Borrar aceleración en cada cuadro
    this.acceleration.mult(0);
  };
  this.display = function() {
    image(logo, this.position.x,this.position.y,this.mass*16,this.mass*16);

  };

// Rebotar contra la parte inferior de la ventana
  this.checkEdges = function() {

    if (this.position.y > ((height - (height/10)) - this.mass*8)) {
      // Un poco de amortiguamiento al rebotar contra el fondo
      this.velocity.y *= -0.9;
      this.position.y = ((height - (height / 10)) - this.mass * 8);
      this.cotadorRebotes += 1;
      // console.log(this.cotadorRebotes );
    }

  };
}

// Snowflake class
function Snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 5);

  // radius of Snowflake spiral
  // chosen so the Snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size Snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete Snowflake if past end of screen
    if (this.posY > (height - (height/3) + 5)) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };
  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}
