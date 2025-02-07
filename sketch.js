let imagenPelota;
let imagenRaquetaJugador;
let imagenRaquetaComputadora;
let imagenFondo;

let pelota;
let raquetaJugador;
let raquetaComputadora;

let sonidoRaqueta;
let sonidoPunto;

let puntosJugador = 0;
let puntosComputadora = 0;

let nombreJugador = prompt("Ingresa tu nombre:", "Jugador");
let juegoIniciado = false;
let nivelDificultad = "normal"; // Nivel de dificultad predeterminado

let botonInicio;
let menuDificultad; // Menú desplegable para la dificultad

function preload() {
  imagenPelota = loadImage('images/pelota.png');
  imagenRaquetaJugador = loadImage('images/raqueta1.png');
  imagenRaquetaComputadora = loadImage('images/raqueta2.png');
  imagenFondo = loadImage('images/fondo2.png');
  sonidoRaqueta = loadSound('Bounce.wav');
  sonidoPunto = loadSound('Punto.wav');
}


function setup() {
  createCanvas(800, 400);
  pelota = new Pelota(400, 200, 30, 5, 5);
  raquetaJugador = new Raqueta(5, height / 2 - 50, 20, 100, 5);
  raquetaComputadora = new Raqueta(width - 25, height / 2 - 50, 20, 100, 5);

  menuDeDificultad(); // Llama al menú de dificultad
  botondeInicio();// Llama botón de inicio
  
}

  function botondeInicio() {
    botonInicio = createButton('Iniciar Juego');
    botonInicio.position(width / 2 - 50, height / 2 + 50);
    botonInicio.mousePressed(iniciarJuego);
  }

function menuDeDificultad() {
  // Crear menú de dificultad
  menuDificultad = createSelect();
  menuDificultad.option('fácil');
  menuDificultad.option('normal');
  menuDificultad.option('demonio');
  menuDificultad.selected('normal'); // Seleccionar "normal" por defecto
  menuDificultad.position(width / 2 - 50, height / 2 + 10);

}

function iniciarJuego() {
  nivelDificultad = menuDificultad.value(); // Obtener dificultad seleccionada
  juegoIniciado = true;
  setTimeout(() => {
    let Inicio = `Esta gran Enputadora ha encontrado a ${nombreJugador} el cual sera victima de mi gran poder deprocesamiento, !JAJAJA  JAJAJA¡`;
    let mensajeInicio = new SpeechSynthesisUtterance(Inicio);
    mensajeInicio.lang = 'es-MX';    
    speechSynthesis.speak(mensajeInicio);
  }, 500); // Espera 500ms
  botonInicio.remove();
  menuDificultad.remove(); // Eliminar el menú de dificultad
}

function narrarPuntos() {
  let puntos = `Jugador ${nombreJugador} ${puntosJugador} - Enputadora ${puntosComputadora}`;
  let ganador = `¡Felicidades, ${nombreJugador}! Has vencido a esta Gran Emputadora por ${puntosJugador - puntosComputadora} puntos, Pero tu suerte no durara por siempre.  ¿Te atreves a jugar de nuevo?`;
  let perdedor = `Lo siento mucho, ${nombreJugador}. Yo la Maravillosa Emputadora te he dado una reverenda paliza por ${puntosComputadora - puntosJugador} puntos,  Te Pregubto:  ¿tienes las agallas para jugar de nuevo?.`;

  let mensaje0 = new SpeechSynthesisUtterance(puntos);
  let mensaje1 = new SpeechSynthesisUtterance(ganador);
  let mensaje2 = new SpeechSynthesisUtterance(perdedor);

  mensaje0.lang = 'es-MX';
  mensaje1.lang = 'es-MX';
  mensaje2.lang = 'es-MX';

  let voices = speechSynthesis.getVoices();
  let femaleVoice = voices.find(voice => voice.lang === 'es-MX' && voice.name.includes('female'));

  if (femaleVoice) {
    mensaje0.voice = femaleVoice;
    mensaje1.voice = femaleVoice;
    mensaje2.voice = femaleVoice;
  } else {
    console.error('No se encontró una voz femenina en español de México.');
  }

  speechSynthesis.speak(mensaje0);

  if (puntosJugador === 5) {
    setTimeout(() => {
      speechSynthesis.speak(mensaje1);
      alert('¡Ganaste!');
      reiniciarJuego();
    }, 500); // Espera 500ms
  } else if (puntosComputadora === 5) {
    setTimeout(() => {
      speechSynthesis.speak(mensaje2);
      alert('¡Perdiste!');
      reiniciarJuego();
    }, 500); // Espera 500ms
  }
}

function reiniciarJuego() {
  puntosJugador = 0;
  puntosComputadora = 0;
  juegoIniciado = false; // El juego se reinicia, no está en curso
  menuDeDificultad(); // Llama al menú de dificultad
  botondeInicio();// Llama botón de inicio
  
}

function draw() {
  image(imagenFondo, 0, 0, width, height);

  if (juegoIniciado) { // Solo actualizar y dibujar si el juego ha iniciado
    pelota.update();
    pelota.draw();
    raquetaJugador.update();
    raquetaJugador.draw();
    raquetaComputadora.seguirPelota(pelota);
    raquetaComputadora.update();
    raquetaComputadora.draw();
  }

  // Mostrar puntaje en pantalla
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER); // Centrar el texto
  text(nombreJugador + ": " + puntosJugador, width / 4, 50);
  text("Enputadora: " + puntosComputadora, 3 * width / 4, 50);
}

function keyPressed() {
  if (juegoIniciado) { // Solo responder a las teclas si el juego ha iniciado
    if (keyCode === UP_ARROW) {
      raquetaJugador.setDireccion(-1);
    } else if (keyCode === DOWN_ARROW) {
      raquetaJugador.setDireccion(1);
    }
  }
}

function keyReleased() {
  if (juegoIniciado) { // Solo responder a las teclas si el juego ha iniciado
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
      raquetaJugador.setDireccion(0);
    }
  }
}

class Pelota {
  constructor(x, y, diametro, vx, vy) {
    this.x = x;
    this.y = y;
    this.diametro = diametro;
    this.vx = vx * (Math.random() < 0.5 ? -1 : 1);
    this.vy = vy * (Math.random() < 0.5 ? -1 : 1);
    this.angulo = 0;
    this.velocidadGiro = 0.05; // Velocidad de giro inicial
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angulo += this.velocidadGiro; // Rotación

    if (this.x > width - this.diametro / 2 || this.x < this.diametro / 2) {
      sonidoPunto.play();
      if (this.x < this.diametro / 2) {
        puntosComputadora++;
      } else {
        puntosJugador++;
      }
      narrarPuntos();

      this.reset();
    }
    if (this.y > height - this.diametro / 2 || this.y < this.diametro / 2) {
      this.vy *= -1;
    }

    this.checkCollision(raquetaJugador);
    if (
      this.x - this.diametro / 2 < raquetaJugador.x + raquetaJugador.ancho &&
      this.x + this.diametro / 2 > raquetaJugador.x &&
      this.y - this.diametro / 2 < raquetaJugador.y + raquetaJugador.alto &&
      this.y + this.diametro / 2 > raquetaJugador.y
    ) {
      this.vx *= 1.1;
      this.vy *= 1.1;
      this.velocidadGiro *= 1.1; // Aumenta la velocidad de giro
    }
    this.checkCollision(raquetaComputadora);
  }

  checkCollision(raqueta) {
    if (
      this.x - this.diametro / 2 < raqueta.x + raqueta.ancho &&
      this.x + this.diametro / 2 > raqueta.x &&
      this.y - this.diametro / 2 < raqueta.y + raqueta.alto &&
      this.y + this.diametro / 2 > raqueta.y
    ) {
      sonidoRaqueta.play();
      this.vx *= -1;

      // Calcula el ángulo de rebote sin restricciones
      let angle = map(this.y - raqueta.y, 0, raqueta.alto, -PI / 4, PI / 4);

      // Ajusta el ángulo para que esté dentro de los rangos permitidos
      if (this.vx > 0) { // Rebote hacia la derecha
        angle = constrain(angle, radians(35), radians(80));
      } else { // Rebote hacia la izquierda
        angle = constrain(angle, radians(280), radians(315));
      }

      this.vy = 5 * sin(angle);
      this.velocidadGiro *= 1.1;
    }
  }

  reset() {
    this.x = 400;
    this.y = 200;
    this.vx = 5 * (Math.random() < 0.5 ? -1 : 1);
    this.vy = 5 * (Math.random() < 0.5 ? -1 : 1);
    this.angulo = 0;
    this.velocidadGiro = 0.01; // Restablece la velocidad de giro
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    imageMode(CENTER);
    image(imagenPelota, 0, 0, this.diametro, this.diametro);
    pop();
  }
}

class Raqueta {
  constructor(x, y, ancho, alto, velocidad) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.velocidad = velocidad;
    this.direccion = 0;
  }

  update() {
    if (juegoIniciado) { // Solo responder al mouse si el juego ha iniciado
      this.y = mouseY - this.alto / 2; // Centrar la raqueta en el mouse
      this.y = constrain(this.y, 0, height - this.alto); // Mantener la raqueta dentro del lienzo
    } else {
      this.y += this.direccion * this.velocidad; // Movimiento con flechas (si el juego no ha iniciado)
      this.y = constrain(this.y, 0, height - this.alto);
    }

    
    this.y += this.direccion * this.velocidad;
    this.y = constrain(this.y, 0, height - this.alto);
  }

  

  draw() {
    if (this === raquetaJugador) {
      image(imagenRaquetaJugador, this.x, this.y, this.ancho, this.alto);
    } else {
      image(imagenRaquetaComputadora, this.x, this.y, this.ancho, this.alto);
    }
  }

  setDireccion(direccion) {
    this.direccion = direccion;
  }

  seguirPelota(pelota) {
    let velocidadReaccion = 0; // Velocidad de reacción de la IA

    switch (nivelDificultad) {
      case "fácil":
        velocidadReaccion = 0.5; // Reacciona más lento
        break;
      case "normal":
        velocidadReaccion = 1; // Velocidad de reacción normal
        break;
      case "demonio":
        velocidadReaccion = 1.5; // Reacciona más rápido
        break;
    }

    // Anticipar la trayectoria de la pelota (más inteligente)
    let prediccionY = pelota.y + pelota.vy * 5; // Predicción simple

    if (prediccionY < this.y + this.alto / 2) {
      this.direccion = -1 * velocidadReaccion;
    } else if (prediccionY > this.y + this.alto / 2) {
      this.direccion = 1 * velocidadReaccion;
    } else {
      this.direccion = 0;
    }
  }

}

function touchStarted() {
  if (juegoIniciado) {
    raquetaJugador.y = touchY - raquetaJugador.alto / 2; // Ajustar posición al tocar la pantalla
    raquetaJugador.y = constrain(raquetaJugador.y, 0, height - raquetaJugador.alto);
  }
}

function touchMoved() {
  if (juegoIniciado) {
    raquetaJugador.y = touchY - raquetaJugador.alto / 2; // Seguir el dedo en la pantalla
    raquetaJugador.y = constrain(raquetaJugador.y, 0, height - raquetaJugador.alto);
  }
}
