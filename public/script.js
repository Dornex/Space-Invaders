window.open = () => {
    localStorage.setItem('clicks', '0');
};

changeColor = (event) => {
    event.target.innerText = "ABOUT " + localStorage.getItem('clicks');
    event.target.style.color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}) `;
    event.target.setAttribute('clicks', localStorage.getItem('clicks'));
    let clicks = localStorage.getItem('clicks');
    let intClicks = parseInt(clicks);
    intClicks++;
    localStorage.setItem('clicks', intClicks.toString());
};

let ind = 0;
let intervalId;

window.onload = () => {
    localStorage.setItem('clicks', '0');
    console.log(document.querySelector("h3"));
    document.querySelector("h3").addEventListener('click', changeColor);
    document.querySelector("footer").addEventListener('click', showMousePos);
    document.querySelector(".menu-toggle").addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });
    document.querySelector('.bg-img').addEventListener('click', stopBackground, true);
    intervalId = setInterval(changeBackground, 5000, '/assets');
    setInterval(changeFontColor, 5000)
};

changeFontColor = () => {
    document.querySelector("#header-container").classList.toggle('blue');
};

showMousePos = (event) => {
    event.stopPropagation();
    document.getElementById('mousePos').innerText = `posX:${event.pageX}       posY:${event.pageY}`;
};

stopBackground = () => {
    clearInterval(intervalId);
};



changeBackground = (path) => {
    if(ind === 2) ind = -1;
    ind++;
    document.querySelector('.bg-img').style.backgroundImage = `url('${path + '/background' + ind.toString() + '.jpg'}`;
};

window.close = () => {
    localStorage.clear();
};