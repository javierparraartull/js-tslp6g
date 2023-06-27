const canvasSketch = require('canvas-sketch');
const math = require ('canvas-sketch-util/math');
const random = require ('canvas-sketch-util/random');
const Color = require ('canvas-sketch-util/color'); // Biblioteca para manipulación de colores
const risoColors = require('riso-colors'); //Importamos la biblioteca de RisoColors


const settings = {
  dimensions: [1080,1080],
  //dimensions: 'A3',
  //pixelsPerInch:300,
  animate:true,  
};

const sketch = ({context,width,height}) => {

  //Variables con las distintas propiedades
  let x,y,w,h, fill,stroke, blend;
  
  //Número de rectángulos  
  const num=40;
  //Grados de inclinación
  const degrees = -30;

  //Creamos una matriz para almanecer los datos de los rectángulos que se generen aleatoriamente
  
  const rects = [];

  //Creamos una matriz para almacenar un número reducido de colores aleatorios

  const rectColors = [

    random.pick(risoColors),
    random.pick(risoColors),
   // random.pick(risoColors),
  ];

  //Elegimos un color de fondo  
 
  const bgColor = random.pick(rectColors).hex;

  const mask = {

      radius: width *0.4,
      sides:3,
      x: width *0.5,
      y: height * 0.5,


  };

  for (let i=0; i < num; i++){

    x=random.range(0,width),
    y=random.range(0,height),
    w=random.range(400,600),
    h=random.range(20,200);


   //Relleno con colores aleatorios formato RGBA = RGB+tranparencia
   //Podemos usar referencias de paletas como RISO INK COLORS para que se vean mejor

    fill = `rgba(${random.range(0,255)},${random.range(0,255)},${random.range(0,255)},${random.range(1,1)})`;
    
    fill = random.pick(rectColors).hex; // esta función importa colores de RisoColors
    stroke = random.pick(rectColors).hex;

    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';


    rects.push({x,y,w,h, fill,stroke,blend});

  }

 // let radius, angle,rx,ry;

    return({context,width,height}) => {
      context.fillStyle = bgColor;
      context.fillRect(0,0,width,height);

      

      context.save();
      context.translate (mask.x, mask.y);
      context.translate(width*0.5,height*0.5);
     // context.translate(x,y);

     //DIBUJAMOS TRIANGULO DE RECORTE

      //context.beginPath();
      //context.moveTo(0,-300);
      //context.lineTo(300,200);
      //context.lineTo(-300,200)
      //context.closePath();

      //DIBUJAMOS POLIGONO DE RECORTE

      drawPolygon({context, radius:mask.radius, sides:mask.sides});

     
     // context.restore();
      context.clip();

      

      rects.forEach(rect => {

        //PREPARAMOS EL RECTÁNGULO

        const {x,y,w,h,fill,stroke,blend}=rect;
        let shadowColor; //Variable para la sombra de color
        context.save();
        context.translate (mask.x,mask.y);
        context.strokeStyle = stroke;  //Estilo del trazo
        context.fillStyle = fill;      //Estilo de relleno
        context.lineWidth = 10;        //Grosor del trazo de la linea

        context.globalCompositeOperation = blend;
        
        //DIBUJAMOS EL RECTÁNGULO

        drawSkewedRect({context,w,h,degrees});

        //Preparamos la sombra del color a partir de: COLOR, COMPENSACIÓN TONO, SATURACIÓN, LUMINANCIA
        shadowColor = Color.offsetHSL(fill,0,0,-20); 
        shadowColor.rgba[3] = 0.6; 

        //LE DAMOS SOMBRA AL RECTANGULO
        // context.shadowColor = 'black';  //Sombra negra
        // context.shadowColor = 'rgba(0,0,0,0.5)'; // Sombra gris semitransparente
        context.shadowColor = Color.style(shadowColor.rgba);

        context.shadowOffsetX = -5;
        context.shadowOffsetY = 10;

        context.fill();               //Dibujamos los rellenos
        context.shadowColor = null;   //Quitamos la sombra para hacer los trazos
        context.stroke();             //Dibujamos los trazos

        context.globalCompositeOperation = 'source-over';

        //LUEGO PODEMOS HACER UNA LINEA NEGRA DE NUEVO PARA REMARCAR LAS FIGURAS
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();

        context.restore();


      });

    
      context.restore();

      context.save();
      context.translate(mask.x,mask.y);

     drawPolygon({context, radius:mask.radius, sides:mask.sides});

      
      context.lineWidth=10;
      context.strokeStyle='black';
      context.stroke();
      context.restore();




    };

};  

const drawSkewedRect = ({context,w=600,h=200,degrees=-45}) => {

  const angle =  math.degToRad(degrees); 
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate (rx * -0.5, (ry+h) * -0.5);


 // context.strokeRect (w * -0.5, h * -0.5 ,w,h);
  
context.beginPath();
context.moveTo(0, 0 );
context.lineTo(rx, ry);
context.lineTo(rx, ry + h);
context.lineTo(0, h);
context.closePath();
context.stroke(); 

context.restore();

}

const drawPolygon= ({context, radius=100, sides=3}) => {
  const slice = Math.PI * 2 / sides; //Segmento
  context.beginPath();
  context.moveTo(0,-radius);
for (let i=1;i < sides; i++){
  const theta=i*slice - Math.PI * 0.5; // Con el Math.PI*0.5 empezamos a las 12 como punto de partida. 0 grados son las 3
  context.lineTo(Math.cos(theta)*radius, Math.sin(theta)*radius);

}

context.closePath();

}

canvasSketch (sketch,settings); 