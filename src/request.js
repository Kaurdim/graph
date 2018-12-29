import drowGraph from './drowGraph'

function request(id, count, bugs, links, requests) {
    let preloader = document.querySelector('.preloader');
    let graph = document.querySelector('.graph');
    let xhr = new XMLHttpRequest();

    xhr.open("GET", 'https://bugs.etersoft.ru/rest/bug/' + id + '?include_fields=depends_on,blocks', true);
    requests.push(xhr);
    xhr.send();
    console.log('id- ', id);
    console.log('count', count);
    preloader.classList.remove('hide');
    graph.classList.add('hide');

    xhr.onreadystatechange = function () {
        if(xhr.status === 401) {
            alertMsg(id);
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
                let bagText = JSON.parse(xhr.responseText);
                //получем боги от которых зависит запрашивемый баг
                let bagBlock = bagText.bugs[0].blocks;
                //получем зависящие от него баги
                let bagDepends = bagText.bugs[0].depends_on;
                //создаем динаимический массив зависимостей бага
                let childBugs = [...returnElem(bagBlock), ...returnElem(bagDepends)];
                console.log('это текущие', childBugs);
                //добавляем узлы графа
                for (let i = 0; i < childBugs.length; i++) {
                    if (bugs.indexOf(childBugs[i]) === -1) {
                        bugs.push(childBugs[i]);
                    }
                }
                //создаине массива зависимостей
                let i = 4 >= bagBlock.length ? bagBlock.length - 1 : 3;
                for (; i >= 0; i--) {
                    links.push(createLinks(id, bagBlock[i], 'green'));
                }

                let g = 4 >= bagDepends.length ? bagDepends.length - 1 : 3;
                for (; g >= 0; g--) {
                    links.push(createLinks(id, bagDepends[g], 'red'));
                }

                if (count < 3) {
                    //отправляем запрос для зависимотей бага
                childBugs.forEach(function (value) {
                    return request(value, count + 1, bugs, links, requests)
                });
                //если все запросы выполненны
            }  else if(requests.every(cgeckReq)) {
                    //преобразуем массив узлов
                    let nodes = createNodes(bugs)
                    preloader.classList.add('hide');
                    graph.classList.remove('hide');
                   //отрисовываем граф
                    drowGraph({'nodes': nodes, 'links': links});
                    return;
                }
        }
    }
}


function createNodes(arr) {
    let nodes = []
    arr.forEach(function (id) {
        nodes.push({'id':id })
    });
    return nodes;
}


function createLinks(id, target, value) {
    return {'source':id, 'target': target, 'value': value}
}

function returnElem(arr) {
    let firstElem = [];
    let i = 4 >= arr.length ? arr.length-1 : 3;
    for(; i >= 0; i--){
        firstElem.push(arr[i]);
    }
    return firstElem;
}

function cgeckReq(item) {
    return item.readyState == 4;
}
function alertMsg(id) {
    let p = document.createElement('p');
    p.innerHTML = `Информация об ошибке с id ${id} недоступна`;
    let container = document.querySelector('.errors-message');
    container.appendChild(p);
}
export default request;