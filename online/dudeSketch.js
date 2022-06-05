
let table;
let img1, imgBase;
let avgHeight = 0;
let avgWeight = 0;

let collegeDivs = [];



function preload() {
    img1 = loadImage("dude_blk.png");
    imgBase = loadImage("dude_outline.png");
    table = loadTable('dudeDatafile.csv', 'csv', 'header');
}

function setup() {
    let cnv = createCanvas(windowWidth, 600);
    cnv.parent("dude");
    //imageMode(CENTER);
    img1.resize(img1.width / 2, img1.height / 2);
    imgBase.resize(img1.width, img1.height);

    for (let i = 0; i < table.getRowCount(); i++) {
        console.log(table.getString(i, 3));
        avgHeight += +table.getString(i, 2);
        avgWeight += +table.getString(i, 3);
    }
    avgHeight /= table.getRowCount();
    //console.log(avgHeight);
    avgWeight /= table.getRowCount();
    //console.log(avgWeight);

    for (let i = 0; i < table.getRowCount(); i++) {
        let div = createDiv(table.getString(i, 0));
        div.parent("colleges");
        div.mousePressed(() => clickedDiv(table.getString(i, 0), table.getString(i, 2), table.getString(i, 3),  table.getString(i, 5),  table.getString(i, 6),  table.getString(i, 7)));
        collegeDivs.push(div);
    }
}

function keyPressed() {
    let tableArr = table.getArray();

    if (key == 'a') {
        let sortedWeight = tableArr.sort((a, b) => a[3] > b[3]? 1: -1);
        console.log(sortedWeight);
        for (let i = 0; i < collegeDivs.length; i++) {
            let div = collegeDivs[i];
            div.mousePressed(() => clickedDiv(sortedWeight[i][0], sortedWeight[i][2], sortedWeight[i][3], sortedWeight[i][5], sortedWeight[i][6], sortedWeight[i][7]));
            div.html(sortedWeight[i][0]);
        }
    }

    else if (key == 's') {
        let sortedHeight = tableArr.sort((a, b) => a[2] > b[2]? 1: -1);
        console.log(sortedHeight);
        for (let i = 0; i < collegeDivs.length; i++) {
            let div = collegeDivs[i];
            div.mousePressed(() => clickedDiv(sortedHeight[i][0], sortedHeight[i][2], sortedHeight[i][3], sortedHeight[i][5], sortedHeight[i][6], sortedHeight[i][7]));
            div.html(sortedHeight[i][0]);
        }
    }

    else if (key == 'd') {
        let sortedABC = tableArr.sort((a, b) => a[0] > b[0]? 1: -1);
        console.log(sortedABC);
        for (let i = 0; i < collegeDivs.length; i++) {
            let div = collegeDivs[i];
            console.log("test", sortedABC[i][0]);
            div.mousePressed(() => clickedDiv(sortedABC[i][0], sortedABC[i][2], sortedABC[i][3], sortedABC[i][5], sortedABC[i][6], sortedABC[i][7]));
            div.html(sortedABC[i][0]);
           
            // console.log(sortedABC[i][5]);
        }
    }

}

function clickedDiv(name, Cheight, Cweight, pts1, reb2, ast3){


    fill(255);
    noStroke();
    rect(400, 0, 500, 1000);

    let startW = img1.width;
    let startH = img1.height;


    // average = 199.85891042085504
    let dudeHeight = Cheight;
    let percentH = 1 + (dudeHeight - avgHeight) / avgHeight;
    //console.log(percentH)

    //Average = 99.06427347162118
    let dudeWeight = Cweight;
    let exagFactor = 1.07;
    let percentW = 1 + (dudeWeight - avgWeight) / avgWeight;
    //console.log(percentW)

    let w = startW * percentW * exagFactor;
    let h = startH * percentH * exagFactor;
    console.log(h - startH, startH)

    fill(0);
    text(`Height: ${round(Cheight, 2)} cm`, 400, 80);
   
    text(`Weight: ${round(Cweight, 2)} kg`, 400, 100);


    

    image(img1, 500, 100 - (h - startH), w, h);
    text("Points")
    barChartPTS(pts1, 400, 80);
    barChartREB(reb2, 400, 130);
    barChartAST(ast3, 400, 180);

}

function barChartPTS(val, x, y) {
    let barW = 100;
    let barH = 30;
    
   
    let percent = map(val, 0, 21, 0, barW);

    let per = map(val, 0, 21, 0, 1);
    let col = lerpColor(color('red'), color('green'), per);

    push();
    translate(x, y);
    noFill();
    stroke(0);
    rect(x, y, barW, barH);

    fill(col);
    rect(x, y, percent, barH);
    pop();
}
function barChartAST(val, x, y) {
    let barW = 100;
    let barH = 30;
    

    let percent = map(val, 0, 5.7, 0, barW);

    let per = map(val, 0, 5.7, 0, 1);
    let col = lerpColor(color('red'), color('green'), per);

    push();
    translate(x, y);
    noFill();
    stroke(0);
    rect(x, y, barW, barH);

    fill(col);
    rect(x, y, percent, barH);
    pop();
}
function barChartREB(val, x, y) {
    let barW = 100;
    let barH = 30;
   

    let percent = map(val, 0, 16.1, 0, barW);

    let per = map(val, 0, 16.1, 0, 1);
    let col = lerpColor(color('red'), color('green'), per);

    push();
    translate(x, y);
    noFill();
    stroke(0);
    rect(x, y, barW, barH);

    fill(col);
    rect(x, y, percent, barH);
    pop();
}

function displayBase() {
    let startW = img1.width;
    let startH = img1.height;
    
    let w = startW;
    let h = startH;
    image(imgBase, 100, 100, w, h);
   
    

}
function draw() {
    //background('red')
    fill(0);
    noStroke();
    text('Height: 199.86 cm', 30, 80);
    text('Weight: 99 kg', 30, 100);
    
    displayBase();

}
