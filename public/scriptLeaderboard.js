

window.onload = () => {
    let tableChildren = document.querySelector('table').children;
    tableChildren[0].children[1].addEventListener('click', changeTable);
};

changeTable = (event) => {

    event.target.style.backgroundColor = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}) `;
    let style = getComputedStyle(event.target);
    let tableChildren = document.querySelector('table').children[0].children;
    for(let i = 0; i < tableChildren.length; i++) {
        tableChildren[i].children[1].style.backgroundColor = style.backgroundColor;
        tableChildren[i].children[0].style.backgroundColor = style.backgroundColor;
        tableChildren[i].children[2].style.backgroundColor = style.backgroundColor;
    }
    console.log(tableChildren);
};