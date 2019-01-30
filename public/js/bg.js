const body =document.querySelector("body > .back_img");

const IMG_NUMBER = 4;

function handleImgLoad() {
    console.log("finished loading");
}

function paintImage(imgNumber) {
    const image = new Image();
    image.src =`images/${imgNumber+1}.jpg`;
    image.classList.add("bgImage");
    body.appendChild(image);
}

function genRandom(){
    const number = Math.floor(Math.random()* IMG_NUMBER);
    return number;
}

function init() {
    //const randomNumber = genRandom();
    for(var i=0;i<IMG_NUMBER;i++){
        setTimeout("sleep("+i+")",i*5000);
    }
}

function sleep(num){
    //alert('hello');
    paintImage(num);
    //console.log('5 sec');
}

init();