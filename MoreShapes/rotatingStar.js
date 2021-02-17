
var starPolygon = [] 
  
function setup() { 
    
    // Init the HTML5 Canvas of given size 
    createCanvas(800, 600); 
      
    /* Vertices for a star-polygon (decagon) */
    let x = [440, 468, 534, 486, 498, 
             440, 382, 394, 346, 412]; 
             
    let y = [230, 290, 300, 344, 410, 
             380, 410, 344, 300, 290]; 
    
    /* Converting given vertices to 
        an array of vectors */
    for (let i = 0; i < x.length; ++i) 
        starPolygon.push(createVector(x[i], y[i])); 
} 
    
function rotatePolygon(vertices, degree){ 
    
    // Converting degree to radians! 
    degree = radians(degree); 
      
    for(let i = 0; i < vertices.length; ++i) { 
    
        // Storing the previous values so they 
        // don't get overwritten 
        let x = vertices[i].x, y = vertices[i].y; 
          
        vertices[i].x = x*cos(degree)-y*sin(degree); 
        vertices[i].y = x*sin(degree)+y*cos(degree); 
    } 
} 
    
function calcMidpoint(vertices) { 
    let midpoint = createVector(0, 0) 
      
    for (let i = 0; i < vertices.length; i++) 
        midpoint.add(vertices[i]); 
      
    return midpoint.div(vertices.length) 
} 
    
function translatePolygon(vertices, x, y) { 
    for(let i = 0; i < vertices.length; i++){ 
      vertices[i].x += x; 
      vertices[i].y += y; 
    } 
} 
    
function draw() { 
    
    // Clear everything with grey background 
    background(255); 
    rotatePolygon(starPolygon,1); 
    drawPolygon(starPolygon); 
    let a = calcMidpoint(starPolygon); 
    
    // Origin the polygon to center 
    // and draw it at (400, 300) 
    translatePolygon(starPolygon, 400-a.x, 300-a.y) 
} 
        
// This is how you draw a polygon in p5.js 
function drawPolygon(vertices) { 
    
    beginShape(); 
      
    for (let i = 0; i < vertices.length; ++i) 
        vertex(vertices[i].x, vertices[i].y); 
      
    fill(255, 217, 0); 
   
    // If you don't close it then it'd  
    // draw a chained line-segment 
    endShape(CLOSE); 
} 
