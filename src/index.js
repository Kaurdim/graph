import './css/style.css';
import './css/preloader.css';

import request from './request';


console.log(1);


function runApp(input) {
    let links = [];
    let arr = [];
    let id = parseInt(input.value);
    if (!id) {return false;}
    let graphArea = document.querySelector('.graph');
    let errors = document.querySelector('.errors-message');
    graphArea.innerHTML = '';
    errors.innerHTML = '';
    let bugs = [id];
    request(id,0,bugs,links,arr);
}

let btn = document.querySelector('button');
let input = document.getElementById('bugId');

btn.addEventListener('click', runApp.bind(this,input));
