
let table;
let img;
let avgHeight = 0;
let avgWeight



function preload() {
    img = loadImage("dude_blk.svg");
    img = loadImage("dude_outline.svg");
    table = loadTable('dudeDatafile.csv', 'csv', 'header');
}

function setup() {
    let cnv = createCanvas(windowWidth, 2000);
    cnv.parent("dude");
    for(let i = 0; i<table.getRowCount(); i++){
        //console.log(table.getString(i, 0));
        avgHeight += +table.getString(i,2);
        avgWeight += +table.getString(i,3);
    }
    avgHeight /= table.getRowCount();
    avgWeight /= table.getRowCount();
}

function draw() {
    //background('red')

    let startW = img.width;
    let startH = img.height;

 

    // average = 200
    let dudeHeight = 207;
    let percentH = 1+(dudeHeight - avgHeight)/avgHeight;
    console.log(percentH)
   
    let w = startW * 1;
    let h = startH * percentH;
    image(img, 100, 100, w, h);
    text("name", 100, 110)


}