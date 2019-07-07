import drowGraph from './drowGraph'

function request(id, count, bugs, links, requests) {
	const preloader = document.querySelector('.preloader');
	const graph = document.querySelector('.graph');

	const url = `https://bugs.etersoft.ru/rest/bug/${id}?include_fields=depends_on,blocks`;
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	requests.push(xhr);
	xhr.send();

	preloader.classList.remove('hide');
	graph.classList.add('hide');

	xhr.onreadystatechange = function () {
		if (xhr.status === 401) {
			alertMsg(id);
		}
		if (xhr.readyState == 4 && xhr.status == 200) {
			let bagText = JSON.parse(xhr.responseText);
			//получем баги от которых зависит запрашивемый баг
			let bagBlock = bagText.bugs[0].blocks;
			//получем зависящие от него баги
			let bagDepends = bagText.bugs[0].depends_on;
			//создаем динаимический массив зависимостей бага
			let childBugs = [...returnElem(bagBlock), ...returnElem(bagDepends)];
			//добавляем узлы графа
			childBugs.forEach(bug => {
				if (bugs.indexOf(bug) === -1) {
					bugs.push(bug);
				}
			});
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
			} else if (requests.every(checkReq)) {
				//преобразуем массив узлов
				let nodes = createNodes(bugs)
				preloader.classList.add('hide');
				graph.classList.remove('hide');
				//отрисовываем граф
				drowGraph({ 'nodes': nodes, 'links': links });
				return;
			}
		}
	}
}


function createNodes(arr) {
	let nodes = []
	arr.forEach(function (id) {
		nodes.push({ 'id': id })
	});
	return nodes;
}


function createLinks(id, target, value) {
	return { 'source': id, 'target': target, 'value': value }
}

function returnElem(arr) {
	let firstElem = [];
	let i = 4 >= arr.length ? arr.length - 1 : 3;
	for (; i >= 0; i--) {
		firstElem.push(arr[i]);
	}
	return firstElem;
}

function checkReq(item) {
	return item.readyState == 4;
}

function alertMsg(id) {
	let p = document.createElement('p');
	p.innerHTML = `Информация об ошибке с id ${id} недоступна`;
	let container = document.querySelector('.errors-message');
	container.appendChild(p);
}
export default request;