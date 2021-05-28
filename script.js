  function deroule() {
  //fonction qui déroule le panneau des paramètres lors du clic sur le titre h3
  let elem = document.getElementById("parametres");
  if (elem.style.display == "none") {
    elem.style.display = "block";
    document.getElementById("afficher_masquer").innerText =
      "↓ Masquer les contrôles";
  } else {
    elem.style.display = "none";
    document.getElementById("afficher_masquer").innerText =
      "↑ Afficher les contrôles";
  }
}

function genereNombre(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Accès au canvas défini dans la structure HTML
var canvas = document.getElementById("affichage"); 
var ctx = canvas.getContext("2d");

class particule {
  constructor(masse, x_pos, y_pos) {
    this.masse = masse;
    this.x_pos = x_pos;
    this.y_pos = y_pos;

    this.velocite_x = 0;
    this.velocite_y = 0;

    this.force_x = 0;
    this.force_y = 0;

    this.radius = masse/10;

    this.deplacement = true;

    this.color = this.getRandomColor();
  }

  get draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    return color;
  }
}

var n_part = 200;
// Initialisation de 50 particules
var particules = [];
for (let i = 0; i < n_part; i++) {
  let masse = genereNombre(10, 100);
  let radius = 0.0;
  let angle = (2 * Math.PI * i) / n_part;

  if (masse < 50) {
    radius = genereNombre(50, 100);
  } else {
    radius = genereNombre(100, 200);
  }
  let x = canvas.width / 2 + radius * Math.sin(angle);
  let y = canvas.height / 2 + radius * Math.cos(angle);
  let p = new particule(masse, x, y);
  p.velocite_x = -0.01 * radius * Math.cos(angle);
  p.velocite_y = 0.01 * radius * Math.sin(angle);

  p.draw;

  particules.push(p);
}

//Initialisation du soleil immobile au centre du canvas
var soleil = new particule (3000, 400, 300);
particules.push(soleil);
soleil.deplacement = false;
soleil.radius = 20;
soleil.color = 'yellow';
soleil.draw;





function creeParticule(event, particules) {
  // Fonction qui crée une particule et l'affiche.

  var valmasse = document.getElementById('masse'); 
  var valcolor = document.getElementById('couleur'); 

  var mouseX = event.pageX - canvas.offsetLeft; 
  var mouseY = event.pageY - canvas.offsetTop;

  var p = new particule(parseInt(valmasse.value), mouseX, mouseY);

  p.color = valcolor.value;
  particules.push(p);
  p.draw;
}

canvas.addEventListener("dblclick", function (event) {
  creeParticule(event, particules);
  console.log("tu viens de cliquer");
});

var dt = 0.2;

function calculDeplacements(particules, dt) {
  //Fonction qui calcule les déplacements des particules en fonction des forces qui lui sont appliquées
  for(let i=0; i < particules.length; i++) {
    if (particules[i].deplacement == true) {
      particules[i].force_x = 0;
      particules[i].force_y = 0;
    }
    for(let j=0; j < particules.length; j++) {
      if (i != j) {
        dx = particules[j].x_pos - particules[i].x_pos;
        dy = particules[j].y_pos - particules[i].y_pos;
        r = Math.sqrt(dx*dx + dy*dy);

        f = particules[j].masse / (r * r);
        particules[i].force_x += f*(dx/r);
        particules[i].force_y += f*(dy/r);
      }
    }


    ax = particules[i].force_x / particules[i].masse;
    ay = particules[i].force_y / particules[i].masse;

    particules[i].velocite_x += ax*dt;
    particules[i].velocite_y += ay*dt;

    particules[i].x_pos += particules[i].velocite_x * dt;
    particules[i].y_pos += particules[i].velocite_y * dt;
    //supprime les particules hors canvas
    if (particules[i].x_pos < 0 && particules[i].x_pos > 800) {
    	particules.splice(i-1, 1);
    }
    if (particules[i].y_pos < 0 && particules[i].y_pos > 800) {
    	particules.splice(i-1, 1);
    }


    soleil.x_pos = 400;
    soleil.y_pos = 300; //Permet d'avoir un soleil immobile
  }

}


var intervalID;

function animer() {
  clearInterval(intervalID)
  intervalID = setInterval( function() {
  calculDeplacements(particules, dt);

  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let p = 0; p < particules.length; p++) {
    particules[p].draw;
    }
  }, 10); 
}


