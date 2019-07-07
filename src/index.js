import './styles/style.css';
import './styles/preloader.css';

import request from './request';

function runApp(input) {
    const links = [];
    const arr = [];
    let id = parseInt(input.value);
    if (!id) {return false;}
    const graphArea = document.querySelector('.graph');
    const errors = document.querySelector('.errors-message');
    graphArea.innerHTML = '';
    errors.innerHTML = '';
    let bugs = [id];
    request(id,0,bugs,links,arr);
}

const btn = document.querySelector('button');
const input = document.getElementById('bugId');

btn.addEventListener('click', runApp.bind(this, input));
