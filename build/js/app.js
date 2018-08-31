'use strict';

var ajax = function ajax(url, data, callback) {
	var cb = callback || function () {};
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, false);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(data);
	return (xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (xhr.responseText != '') return cb(xhr.responseText);
		} else {
			console.log('err');
		}
	})();
};
'use strict';

(function () {
	var toggleBtn = function toggleBtn(idBtn) {
		/*
  	idBtn - id кнопки при нажатии на которую происходит прерключение
  	data-id-control - id елемента которому добавляется/удаляется класс ".active" после нажатия на кнопку 
  */
		// Клик
		var btn = document.getElementById(idBtn);
		if (btn) {
			btn.addEventListener('click', function () {
				this.classList.toggle('active');
				var idControl = this.getAttribute('data-id-control');
				document.getElementById(idControl).classList.toggle('active');
			});
			// Касание
			btn.addEventListener('touch', function () {
				this.classList.toggle('active');
				var idControl = this.getAttribute('data-id-control');
				document.getElementById(idControl).classList.toggle('active');
			});
		}
	};

	// Кнопка бургер header - преключение навигации
	toggleBtn('btn_burger-header');
})();
'use strict';

(function () {

	if (document.getElementById('chat')) {

		$('#chat__list').niceScroll({ cursorcolor: "#fff" });
		var chat__form = document.getElementById('chat__form');
		var chat__formTextarea = document.getElementById('chat__form-textarea');
		var chat__formFile = document.getElementById('chat__form-file');
		var ctr = chat__form.getAttribute('data-ctr');
		var chat__list = document.getElementById('chat__list');
		var chat__formBtn = document.getElementById('chat__form-btn');
		var chat__listOut = document.getElementById('chat__list-out');

		var template = function template(data) {
			var file = '';
			var date = '';
			if (data) {
				// Файлы
				if (data.img) {
					for (var i = 0, l = data.img.length; l > i; i++) {
						// Если это картинка
						if (data.img[i].search(/[\w](.jpg|.png|.gif|.jpeg)$/gi) + 1) {
							file += '<a href="/img/' + data.img[i] + '" data-lightbox="roadtrip" class="chat__list-box-img chat__list-box-img_file">\n\t\t\t\t\t\t\t<img class="chat__list-img" src="/img/' + data.img[i] + '" alt="" role="presentation">\n\t\t\t\t\t\t</a>\n\t\n\t\t\t\t\t\t<a href="/img/' + data.img[i] + '" class="chat__list-link chat__list-link_download" download>\n\t\t\t\t\t\t\t<i class="fa fa-file"></i> \n\t\t\t\t\t\t\t' + data.img[i] + '\n\t\t\t\t\t\t</a>';
						} else {
							// Ссылка для скачки
							file += '<a href="/img/' + data.img[i] + '" class="chat__list-link chat__list-link_download" download>\n\t\t\t\t\t\t\t<i class="fa fa-file"></i> \n\t\t\t\t\t\t\t' + data.img[i] + '\n\t\t\t\t\t\t\t</a>';
						}
					}
				}

				// Если дата текущего сообщения отличается от предидущей
				if (data.date) {
					date = '<div class="chat__list-item" data-timestamp="' + data.timestamp + ' data-id="' + data.id + '">\n\t\t\t\t\t<div class="chat__list-date chat__list-date_new-day">\n\t\t\t\t\t\t' + data.date + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
				}

				return date + '<div class="chat__list-item" data-timestamp="' + data.timestamp + '" data-id="' + data.id + '">\n\t\t\t\t\t<div class="chat__list-col chat__list-col_1">\n\t\t\t\t\t\t<div class="chat__list-box-img chat__list-box-img_user"><img class="chat__list-img" src="/img/' + data.imgAvatar + '" alt="" role="presentation">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="chat__list-col chat__list-col_2">\n\t\t\t\t\t\t<div class="chat__list-row chat__list-row_1">\n\t\t\t\t\t\t\t<div class="chat__list-name">\n\t\t\t\t\t\t\t\t' + data.name + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="chat__list-time">\n\t\t\t\t\t\t\t\t' + moment.unix(data.timestamp).format('hh:mm') + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="chat__list-row chat__list-row_2">\n\t\t\t\t\t\t\t<div class="chat__list-text ' + (data.status == 'true' ? '' : 'chat__list-text_error') + '">\n\t\t\t\t\t\t\t\t' + (data.status == 'true' ? data.text : 'Error') + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t' + file + '\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
			}
		};

		// Добавить сообщение в чат
		chat__formBtn.addEventListener('click', function (e) {

			e.preventDefault();
			var chat__item_lastId = document.querySelector('#chat__list-out .chat__list-item') ? document.querySelector('#chat__list-out .chat__list-item:last-child').getAttribute('data-id') : 0;

			var formData = new FormData(chat__form);
			formData.append('id', chat__item_lastId);
			ajax(ctr + '?action=add', formData, function (data) {
				chat__formTextarea.value = '';
				chat__formFile.value = '';
				var dataJ = JSON.parse(data);

				for (var i = 0, l = dataJ.length; l > i; i++) {
					chat__listOut.insertAdjacentHTML("beforeEnd", template(dataJ[i]));
				}
				$(chat__list).animate({ scrollTop: $(chat__listOut).height() }, 500, 'swing', function () {});
			});
		});

		// Принять сообщение в чат
		setInterval(function () {

			var chat__item_lastId = document.querySelector('#chat__list-out .chat__list-item:last-child');

			chat__item_lastId = chat__item_lastId ? chat__item_lastId.getAttribute('data-id') : 0;

			ajax(ctr + '?action=accept&id=' + chat__item_lastId, '', function (data) {

				if (data) {
					var dataJ = JSON.parse(data);
					var templateArr = [];

					for (var i = 0, l = dataJ.length; l > i; i++) {
						if (dataJ[i + 1]) {
							if (moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY') != moment.unix(dataJ[i + 1].timestamp).format('DD.MM.YYYY')) {
								dataJ[i].date = moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY');
							}
						}

						templateArr.push(template(dataJ[i]));
					}
					chat__listOut.insertAdjacentHTML("beforeEnd", templateArr.join(' '));
					$(chat__list).animate({ scrollTop: $(chat__listOut).height() }, 500, 'swing', function () {});
				}
			});
		}, 2000);
	}
})();
'use strict';

(function () {
	var reset = function reset(form) {
		var field = form.querySelectorAll('[name]');
		for (var i = 0, l = field.length; l > i; i++) {
			field[i].value = '';
		}
	};

	// document.querySelector('form [type="submit"]').addEventListener("click", function(e){
	// 	e.preventDefault();
	// 	for(let i= 0, l= e.path.length; l > i; i++ ){
	// 		if( e.path[i].tagName.toLowerCase() == 'form' ){
	// 			reset(e.path[i]);
	// 			break;
	// 		}
	// 	}
	// });
})();
'use strict';

(function () {
	var listTickets__btn_loadMore = document.getElementById('list-tickets__btn_load-more');
	var listTickets__list = document.getElementById('list-tickets__list');
	var audio = new Audio();

	var templateItem = function templateItem(data) {
		return '<div class="list-tickets__list-item ' + (data.status == "true" ? "" : "list-tickets__list-item_disabled") + '" data-status="' + data.status + '" data-id="' + data.id + '">\n\t\t\t\t\t\t\t<div class="list-tickets__col list-tickets__col_time">\n\t\t\t\t\t\t\t\t<div class="list-tickets__time">\n\t\t\t\t\t\t\t\t\t' + moment.unix(data.timestamp).format('hh:mm') + ' <br> ' + moment.unix(data.timestamp).format('MMM DD') + '\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="list-tickets__list-item-box list-tickets__list-item-box_center">\n\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-box-row list-tickets__list-item-box-row_1">\n\t\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-col list-tickets__list-item-col_type">\n\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__type">\n\t\t\t\t\t\t\t\t\t\t\t' + data.type + '\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-col list-tickets__list-item-col_ticket">\n\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__ticket">\n\t\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__ticket-box-img"><img class="list-tickets__ticket-img" src="img/' + data.imgAvatar + '" alt="" role="presentation">\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__ticket-box-text">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__ticket-text list-tickets__ticket-text_name">' + data.ticketName + '\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__ticket-text list-tickets__ticket-text_user">' + data.ticketUser + '\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-col list-tickets__list-item-col_conditions">\n\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__conditions">' + data.conditions + '\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-box-row list-tickets__list-item-box-row_2">\n\t\t\t\t\t\t\t\t\t<div class="list-tickets__list-item-col list-tickets__list-item-col_text">\n\t\t\t\t\t\t\t\t\t\t<div class="list-tickets__text">\n\t\t\t\t\t\t\t\t\t\t\t' + data.text + '\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="list-tickets__list-item-col list-tickets__list-item-col_view"><a class="list-tickets__btn list-tickets__btn_go-to btn btn_regular" href="#">\u041F\u0435\u0440\u0435\u0439\u0442\u0438</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>';
	};

	var templateItemList = function templateItemList(data, el) {
		if (data) {
			var dataJ = JSON.parse(data);
			var templateArr = [];
			for (var i = 0, l = dataJ.length; l > i; i++) {
				templateArr.push(templateItem(dataJ[i]));
			}
			el.innerHTML = templateArr.join(' ');
		}
	};

	if (listTickets__list) {

		// Список тикетов при зангрузке страницы
		ajax('tickets.php?action=init', '', function (data) {
			templateItemList(data, listTickets__list);
		});

		// Обновление каждые 60 секунд
		setInterval(function () {
			var listTickets__listItemId = listTickets__list.querySelector('.list-tickets__list-item:last-child') ? listTickets__list.querySelector('.list-tickets__list-item:last-child').getAttribute('data-id') : '';

			ajax('tickets.php?action=more&id=' + listTickets__listItemId, '', function (data) {
				var curItemsTrue = document.querySelectorAll('.list-tickets__list-item[data-status="true"]');
				var dataJ = JSON.parse(data);
				var sumСoincidence = 0;
				var sumItemTrue = 0;
				for (var j = 0, l2 = dataJ.length; l2 > j; j++) {
					if (dataJ[j].status == 'true') {
						sumItemTrue++;
						for (var i = 0, l = curItemsTrue.length; l > i; i++) {
							if (curItemsTrue[i].getAttribute('data-id') == dataJ[j].id) {
								sumСoincidence++;
							}
						}
					}
				}
				if (sumСoincidence != sumItemTrue) {

					audio.load();
					audio.src = 'notification.mp3';
					audio.type = 'audio/mpeg';
					audio.play();
				}

				templateItemList(data, listTickets__list);
			});
		}, 60000);

		// Добавление тикетов при нажатии накнопку
		if (listTickets__btn_loadMore) {
			listTickets__btn_loadMore.addEventListener("click", function (e) {

				var listTickets__listItemId = listTickets__list.querySelector('.list-tickets__list-item:last-child') ? listTickets__list.querySelector('.list-tickets__list-item:last-child').getAttribute('data-id') : '';
				ajax('tickets.php?action=more&id=' + listTickets__listItemId, '', function (data) {
					templateItemList(data, listTickets__list);
				});
			});
		}
	}
})();
'use strict';

(function () {
	var modal__close = function modal__close(el) {
		var modal__close = document.querySelectorAll(el);
		for (var i = 0, l = modal__close.length; l > i; i++) {
			modal__close[i].addEventListener('click', function () {
				document.querySelector('.modal.active').classList.remove('active');
			});

			modal__close[i].addEventListener('touch', function () {
				document.querySelector('.modal.active').classList.remove('active');
			});
		}
	};

	modal__close('.modal__close');
})();
'use strict';

(function () {
	var btnToggle = document.getElementsByClassName('more-info__btn-toggle');

	for (var i = 0, l = btnToggle.length; l > i; i++) {
		btnToggle[i].addEventListener('click', function (e) {
			for (var j = 0, l2 = e.path.length; l2 > j; j++) {
				if (e.path[j].classList.contains('more-info__item')) {
					e.path[j].classList.toggle('active');
					break;
				}
			}
		});
	}
})();
'use strict';

// Активный пункт меню
(function () {
	var funActiveMenu__item = function funActiveMenu__item(event, el) {
		for (var i = 0, l = el.length; l > i; i++) {
			el[i].addEventListener(event, function (e) {
				for (var j = 0, l2 = el.length; l2 > j; j++) {
					el[j].classList.remove('active');
				}

				for (var _j = 0, _l = e.path.length; _l > _j; _j++) {
					if (e.path[_j].tagName == 'LI') {
						e.path[_j].classList.add('active');
						break;
					}
				}
			});
		}
	};

	var funToggleMenu__item = function funToggleMenu__item(event, el) {
		for (var i = 0, l = el.length; l > i; i++) {
			el[i].addEventListener(event, function (e) {
				e.target.parentNode.classList.toggle('active');
			});
		}
	};

	// header
	var nav_header = document.querySelectorAll('.nav_header .nav__list-item');
	funActiveMenu__item('click', nav_header);
	funActiveMenu__item('touch', nav_header);

	// sidebar left
	var nav_sidebarLeft_title = document.querySelectorAll('.nav_sidebar-left .nav__list-item_title');
	funToggleMenu__item('click', nav_sidebarLeft_title);
	funToggleMenu__item('touch', nav_sidebarLeft_title);

	var nav_sidebarLeft = document.querySelectorAll('.nav_sidebar-left .nav__list .nav__list .nav__list-item');
	funActiveMenu__item('click', nav_sidebarLeft);
	funActiveMenu__item('touch', nav_sidebarLeft);
})();
'use strict';

// Активный тикет
(function () {
	var funActiveTickets__item = function funActiveTickets__item(event, el) {
		for (var i = 0, l = el.length; l > i; i++) {
			el[i].addEventListener(event, function (e) {
				for (var j = 0, l2 = el.length; l2 > j; j++) {
					el[j].classList.remove('active');
				}

				for (var _j = 0, _l = e.path.length; _l > _j; _j++) {
					if (e.path[_j].classList.contains('tickets__list-item')) {
						e.path[_j].classList.add('active');
						break;
					}
				}
			});
		}
	};

	// sidebar right
	var tickets_sidebarRight = document.querySelectorAll('.tickets_sidebar-right .tickets__list-item');
	funActiveTickets__item('click', tickets_sidebarRight);
	funActiveTickets__item('touch', tickets_sidebarRight);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJidG4vYnRuLmpzIiwiY2hhdC9jaGF0LmpzIiwiZm9ybS9mb3JtLmpzIiwibGlzdC10aWNrZXRzL2xpc3QtdGlja2V0cy5qcyIsIm1vZGFsL21vZGFsLmpzIiwibW9yZS1pbmZvL21vcmUtaW5mby5qcyIsIm5hdi9uYXYuanMiLCJ0aWNrZXRzL3RpY2tldHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBhamF4ID0gZnVuY3Rpb24gYWpheCh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG5cdHZhciBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhoci5vcGVuKCdQT1NUJywgdXJsLCBmYWxzZSk7XG5cdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG5cdHhoci5zZW5kKGRhdGEpO1xuXHRyZXR1cm4gKHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgeGhyLnN0YXR1cyA9PSAyMDApIHtcblx0XHRcdGlmICh4aHIucmVzcG9uc2VUZXh0ICE9ICcnKSByZXR1cm4gY2IoeGhyLnJlc3BvbnNlVGV4dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdlcnInKTtcblx0XHR9XG5cdH0pKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRvZ2dsZUJ0biA9IGZ1bmN0aW9uIHRvZ2dsZUJ0bihpZEJ0bikge1xuXHRcdC8qXHJcbiAgXHRpZEJ0biAtIGlkINC60L3QvtC/0LrQuCDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQutC+0YLQvtGA0YPRjiDQv9GA0L7QuNGB0YXQvtC00LjRgiDQv9GA0LXRgNC60LvRjtGH0LXQvdC40LVcclxuICBcdGRhdGEtaWQtY29udHJvbCAtIGlkINC10LvQtdC80LXQvdGC0LAg0LrQvtGC0L7RgNC+0LzRgyDQtNC+0LHQsNCy0LvRj9C10YLRgdGPL9GD0LTQsNC70Y/QtdGC0YHRjyDQutC70LDRgdGBIFwiLmFjdGl2ZVwiINC/0L7RgdC70LUg0L3QsNC20LDRgtC40Y8g0L3QsCDQutC90L7Qv9C60YMgXHJcbiAgKi9cblx0XHQvLyDQmtC70LjQulxuXHRcdHZhciBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEJ0bik7XG5cdFx0aWYgKGJ0bikge1xuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2YXIgaWRDb250cm9sID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQtY29udHJvbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZENvbnRyb2wpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyDQmtCw0YHQsNC90LjQtVxuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2YXIgaWRDb250cm9sID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQtY29udHJvbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZENvbnRyb2wpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vINCa0L3QvtC/0LrQsCDQsdGD0YDQs9C10YAgaGVhZGVyIC0g0L/RgNC10LrQu9GO0YfQtdC90LjQtSDQvdCw0LLQuNCz0LDRhtC40Lhcblx0dG9nZ2xlQnRuKCdidG5fYnVyZ2VyLWhlYWRlcicpO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cblx0aWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0JykpIHtcblxuXHRcdCQoJyNjaGF0X19saXN0JykubmljZVNjcm9sbCh7IGN1cnNvcmNvbG9yOiBcIiNmZmZcIiB9KTtcblx0XHR2YXIgY2hhdF9fZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X19mb3JtJyk7XG5cdFx0dmFyIGNoYXRfX2Zvcm1UZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X19mb3JtLXRleHRhcmVhJyk7XG5cdFx0dmFyIGNoYXRfX2Zvcm1GaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfX2Zvcm0tZmlsZScpO1xuXHRcdHZhciBjdHIgPSBjaGF0X19mb3JtLmdldEF0dHJpYnV0ZSgnZGF0YS1jdHInKTtcblx0XHR2YXIgY2hhdF9fbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X19saXN0Jyk7XG5cdFx0dmFyIGNoYXRfX2Zvcm1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdF9fZm9ybS1idG4nKTtcblx0XHR2YXIgY2hhdF9fbGlzdE91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X19saXN0LW91dCcpO1xuXG5cdFx0dmFyIHRlbXBsYXRlID0gZnVuY3Rpb24gdGVtcGxhdGUoZGF0YSkge1xuXHRcdFx0dmFyIGZpbGUgPSAnJztcblx0XHRcdHZhciBkYXRlID0gJyc7XG5cdFx0XHRpZiAoZGF0YSkge1xuXHRcdFx0XHQvLyDQpNCw0LnQu9GLXG5cdFx0XHRcdGlmIChkYXRhLmltZykge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsID0gZGF0YS5pbWcubGVuZ3RoOyBsID4gaTsgaSsrKSB7XG5cdFx0XHRcdFx0XHQvLyDQldGB0LvQuCDRjdGC0L4g0LrQsNGA0YLQuNC90LrQsFxuXHRcdFx0XHRcdFx0aWYgKGRhdGEuaW1nW2ldLnNlYXJjaCgvW1xcd10oLmpwZ3wucG5nfC5naWZ8LmpwZWcpJC9naSkgKyAxKSB7XG5cdFx0XHRcdFx0XHRcdGZpbGUgKz0gJzxhIGhyZWY9XCIvaW1nLycgKyBkYXRhLmltZ1tpXSArICdcIiBkYXRhLWxpZ2h0Ym94PVwicm9hZHRyaXBcIiBjbGFzcz1cImNoYXRfX2xpc3QtYm94LWltZyBjaGF0X19saXN0LWJveC1pbWdfZmlsZVwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxpbWcgY2xhc3M9XCJjaGF0X19saXN0LWltZ1wiIHNyYz1cIi9pbWcvJyArIGRhdGEuaW1nW2ldICsgJ1wiIGFsdD1cIlwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHQ8L2E+XFxuXFx0XFxuXFx0XFx0XFx0XFx0XFx0XFx0PGEgaHJlZj1cIi9pbWcvJyArIGRhdGEuaW1nW2ldICsgJ1wiIGNsYXNzPVwiY2hhdF9fbGlzdC1saW5rIGNoYXRfX2xpc3QtbGlua19kb3dubG9hZFwiIGRvd25sb2FkPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxpIGNsYXNzPVwiZmEgZmEtZmlsZVwiPjwvaT4gXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEuaW1nW2ldICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdDwvYT4nO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8g0KHRgdGL0LvQutCwINC00LvRjyDRgdC60LDRh9C60Lhcblx0XHRcdFx0XHRcdFx0ZmlsZSArPSAnPGEgaHJlZj1cIi9pbWcvJyArIGRhdGEuaW1nW2ldICsgJ1wiIGNsYXNzPVwiY2hhdF9fbGlzdC1saW5rIGNoYXRfX2xpc3QtbGlua19kb3dubG9hZFwiIGRvd25sb2FkPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxpIGNsYXNzPVwiZmEgZmEtZmlsZVwiPjwvaT4gXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEuaW1nW2ldICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvYT4nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vINCV0YHQu9C4INC00LDRgtCwINGC0LXQutGD0YnQtdCz0L4g0YHQvtC+0LHRidC10L3QuNGPINC+0YLQu9C40YfQsNC10YLRgdGPINC+0YIg0L/RgNC10LTQuNC00YPRidC10Llcblx0XHRcdFx0aWYgKGRhdGEuZGF0ZSkge1xuXHRcdFx0XHRcdGRhdGUgPSAnPGRpdiBjbGFzcz1cImNoYXRfX2xpc3QtaXRlbVwiIGRhdGEtdGltZXN0YW1wPVwiJyArIGRhdGEudGltZXN0YW1wICsgJyBkYXRhLWlkPVwiJyArIGRhdGEuaWQgKyAnXCI+XFxuXFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNoYXRfX2xpc3QtZGF0ZSBjaGF0X19saXN0LWRhdGVfbmV3LWRheVwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdCcgKyBkYXRhLmRhdGUgKyAnXFxuXFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0PC9kaXY+Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRlICsgJzxkaXYgY2xhc3M9XCJjaGF0X19saXN0LWl0ZW1cIiBkYXRhLXRpbWVzdGFtcD1cIicgKyBkYXRhLnRpbWVzdGFtcCArICdcIiBkYXRhLWlkPVwiJyArIGRhdGEuaWQgKyAnXCI+XFxuXFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNoYXRfX2xpc3QtY29sIGNoYXRfX2xpc3QtY29sXzFcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1ib3gtaW1nIGNoYXRfX2xpc3QtYm94LWltZ191c2VyXCI+PGltZyBjbGFzcz1cImNoYXRfX2xpc3QtaW1nXCIgc3JjPVwiL2ltZy8nICsgZGF0YS5pbWdBdmF0YXIgKyAnXCIgYWx0PVwiXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJjaGF0X19saXN0LWNvbCBjaGF0X19saXN0LWNvbF8yXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNoYXRfX2xpc3Qtcm93IGNoYXRfX2xpc3Qtcm93XzFcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1uYW1lXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEubmFtZSArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC10aW1lXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIG1vbWVudC51bml4KGRhdGEudGltZXN0YW1wKS5mb3JtYXQoJ2hoOm1tJykgKyAnXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNoYXRfX2xpc3Qtcm93IGNoYXRfX2xpc3Qtcm93XzJcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC10ZXh0ICcgKyAoZGF0YS5zdGF0dXMgPT0gJ3RydWUnID8gJycgOiAnY2hhdF9fbGlzdC10ZXh0X2Vycm9yJykgKyAnXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIChkYXRhLnN0YXR1cyA9PSAndHJ1ZScgPyBkYXRhLnRleHQgOiAnRXJyb3InKSArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgZmlsZSArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHQ8L2Rpdj4nO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyDQlNC+0LHQsNCy0LjRgtGMINGB0L7QvtCx0YnQtdC90LjQtSDQsiDRh9Cw0YJcblx0XHRjaGF0X19mb3JtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGNoYXRfX2l0ZW1fbGFzdElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NoYXRfX2xpc3Qtb3V0IC5jaGF0X19saXN0LWl0ZW0nKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0X19saXN0LW91dCAuY2hhdF9fbGlzdC1pdGVtOmxhc3QtY2hpbGQnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSA6IDA7XG5cblx0XHRcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShjaGF0X19mb3JtKTtcblx0XHRcdGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBjaGF0X19pdGVtX2xhc3RJZCk7XG5cdFx0XHRhamF4KGN0ciArICc/YWN0aW9uPWFkZCcsIGZvcm1EYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRjaGF0X19mb3JtVGV4dGFyZWEudmFsdWUgPSAnJztcblx0XHRcdFx0Y2hhdF9fZm9ybUZpbGUudmFsdWUgPSAnJztcblx0XHRcdFx0dmFyIGRhdGFKID0gSlNPTi5wYXJzZShkYXRhKTtcblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGRhdGFKLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0XHRcdGNoYXRfX2xpc3RPdXQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlRW5kXCIsIHRlbXBsYXRlKGRhdGFKW2ldKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JChjaGF0X19saXN0KS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKGNoYXRfX2xpc3RPdXQpLmhlaWdodCgpIH0sIDUwMCwgJ3N3aW5nJywgZnVuY3Rpb24gKCkge30pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyDQn9GA0LjQvdGP0YLRjCDRgdC+0L7QsdGJ0LXQvdC40LUg0LIg0YfQsNGCXG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgY2hhdF9faXRlbV9sYXN0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhdF9fbGlzdC1vdXQgLmNoYXRfX2xpc3QtaXRlbTpsYXN0LWNoaWxkJyk7XG5cblx0XHRcdGNoYXRfX2l0ZW1fbGFzdElkID0gY2hhdF9faXRlbV9sYXN0SWQgPyBjaGF0X19pdGVtX2xhc3RJZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSA6IDA7XG5cblx0XHRcdGFqYXgoY3RyICsgJz9hY3Rpb249YWNjZXB0JmlkPScgKyBjaGF0X19pdGVtX2xhc3RJZCwgJycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cblx0XHRcdFx0aWYgKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgZGF0YUogPSBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0XHRcdHZhciB0ZW1wbGF0ZUFyciA9IFtdO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBkYXRhSi5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmIChkYXRhSltpICsgMV0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKG1vbWVudC51bml4KGRhdGFKW2ldLnRpbWVzdGFtcCkuZm9ybWF0KCdERC5NTS5ZWVlZJykgIT0gbW9tZW50LnVuaXgoZGF0YUpbaSArIDFdLnRpbWVzdGFtcCkuZm9ybWF0KCdERC5NTS5ZWVlZJykpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhSltpXS5kYXRlID0gbW9tZW50LnVuaXgoZGF0YUpbaV0udGltZXN0YW1wKS5mb3JtYXQoJ0RELk1NLllZWVknKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZUFyci5wdXNoKHRlbXBsYXRlKGRhdGFKW2ldKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNoYXRfX2xpc3RPdXQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlRW5kXCIsIHRlbXBsYXRlQXJyLmpvaW4oJyAnKSk7XG5cdFx0XHRcdFx0JChjaGF0X19saXN0KS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKGNoYXRfX2xpc3RPdXQpLmhlaWdodCgpIH0sIDUwMCwgJ3N3aW5nJywgZnVuY3Rpb24gKCkge30pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LCAyMDAwKTtcblx0fVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cdHZhciByZXNldCA9IGZ1bmN0aW9uIHJlc2V0KGZvcm0pIHtcblx0XHR2YXIgZmllbGQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsID0gZmllbGQubGVuZ3RoOyBsID4gaTsgaSsrKSB7XG5cdFx0XHRmaWVsZFtpXS52YWx1ZSA9ICcnO1xuXHRcdH1cblx0fTtcblxuXHQvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtIFt0eXBlPVwic3VibWl0XCJdJykuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHQvLyBcdGUucHJldmVudERlZmF1bHQoKTtcblx0Ly8gXHRmb3IobGV0IGk9IDAsIGw9IGUucGF0aC5sZW5ndGg7IGwgPiBpOyBpKysgKXtcblx0Ly8gXHRcdGlmKCBlLnBhdGhbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09ICdmb3JtJyApe1xuXHQvLyBcdFx0XHRyZXNldChlLnBhdGhbaV0pO1xuXHQvLyBcdFx0XHRicmVhaztcblx0Ly8gXHRcdH1cblx0Ly8gXHR9XG5cdC8vIH0pO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cdHZhciBsaXN0VGlja2V0c19fYnRuX2xvYWRNb3JlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdGlja2V0c19fYnRuX2xvYWQtbW9yZScpO1xuXHR2YXIgbGlzdFRpY2tldHNfX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10aWNrZXRzX19saXN0Jyk7XG5cdHZhciBhdWRpbyA9IG5ldyBBdWRpbygpO1xuXG5cdHZhciB0ZW1wbGF0ZUl0ZW0gPSBmdW5jdGlvbiB0ZW1wbGF0ZUl0ZW0oZGF0YSkge1xuXHRcdHJldHVybiAnPGRpdiBjbGFzcz1cImxpc3QtdGlja2V0c19fbGlzdC1pdGVtICcgKyAoZGF0YS5zdGF0dXMgPT0gXCJ0cnVlXCIgPyBcIlwiIDogXCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbV9kaXNhYmxlZFwiKSArICdcIiBkYXRhLXN0YXR1cz1cIicgKyBkYXRhLnN0YXR1cyArICdcIiBkYXRhLWlkPVwiJyArIGRhdGEuaWQgKyAnXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImxpc3QtdGlja2V0c19fY29sIGxpc3QtdGlja2V0c19fY29sX3RpbWVcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190aW1lXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIG1vbWVudC51bml4KGRhdGEudGltZXN0YW1wKS5mb3JtYXQoJ2hoOm1tJykgKyAnIDxicj4gJyArIG1vbWVudC51bml4KGRhdGEudGltZXN0YW1wKS5mb3JtYXQoJ01NTSBERCcpICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1ib3ggbGlzdC10aWNrZXRzX19saXN0LWl0ZW0tYm94X2NlbnRlclwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1ib3gtcm93IGxpc3QtdGlja2V0c19fbGlzdC1pdGVtLWJveC1yb3dfMVwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1jb2wgbGlzdC10aWNrZXRzX19saXN0LWl0ZW0tY29sX3R5cGVcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190eXBlXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEudHlwZSArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX19saXN0LWl0ZW0tY29sIGxpc3QtdGlja2V0c19fbGlzdC1pdGVtLWNvbF90aWNrZXRcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190aWNrZXRcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190aWNrZXQtYm94LWltZ1wiPjxpbWcgY2xhc3M9XCJsaXN0LXRpY2tldHNfX3RpY2tldC1pbWdcIiBzcmM9XCJpbWcvJyArIGRhdGEuaW1nQXZhdGFyICsgJ1wiIGFsdD1cIlwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190aWNrZXQtYm94LXRleHRcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190aWNrZXQtdGV4dCBsaXN0LXRpY2tldHNfX3RpY2tldC10ZXh0X25hbWVcIj4nICsgZGF0YS50aWNrZXROYW1lICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX3RpY2tldC10ZXh0IGxpc3QtdGlja2V0c19fdGlja2V0LXRleHRfdXNlclwiPicgKyBkYXRhLnRpY2tldFVzZXIgKyAnXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImxpc3QtdGlja2V0c19fbGlzdC1pdGVtLWNvbCBsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1jb2xfY29uZGl0aW9uc1wiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2NvbmRpdGlvbnNcIj4nICsgZGF0YS5jb25kaXRpb25zICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1ib3gtcm93IGxpc3QtdGlja2V0c19fbGlzdC1pdGVtLWJveC1yb3dfMlwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2xpc3QtaXRlbS1jb2wgbGlzdC10aWNrZXRzX19saXN0LWl0ZW0tY29sX3RleHRcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX190ZXh0XCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEudGV4dCArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwibGlzdC10aWNrZXRzX19saXN0LWl0ZW0tY29sIGxpc3QtdGlja2V0c19fbGlzdC1pdGVtLWNvbF92aWV3XCI+PGEgY2xhc3M9XCJsaXN0LXRpY2tldHNfX2J0biBsaXN0LXRpY2tldHNfX2J0bl9nby10byBidG4gYnRuX3JlZ3VsYXJcIiBocmVmPVwiI1wiPlxcdTA0MUZcXHUwNDM1XFx1MDQ0MFxcdTA0MzVcXHUwNDM5XFx1MDQ0MlxcdTA0Mzg8L2E+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+Jztcblx0fTtcblxuXHR2YXIgdGVtcGxhdGVJdGVtTGlzdCA9IGZ1bmN0aW9uIHRlbXBsYXRlSXRlbUxpc3QoZGF0YSwgZWwpIHtcblx0XHRpZiAoZGF0YSkge1xuXHRcdFx0dmFyIGRhdGFKID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHRcdHZhciB0ZW1wbGF0ZUFyciA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBkYXRhSi5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdFx0dGVtcGxhdGVBcnIucHVzaCh0ZW1wbGF0ZUl0ZW0oZGF0YUpbaV0pKTtcblx0XHRcdH1cblx0XHRcdGVsLmlubmVySFRNTCA9IHRlbXBsYXRlQXJyLmpvaW4oJyAnKTtcblx0XHR9XG5cdH07XG5cblx0aWYgKGxpc3RUaWNrZXRzX19saXN0KSB7XG5cblx0XHQvLyDQodC/0LjRgdC+0Log0YLQuNC60LXRgtC+0LIg0L/RgNC4INC30LDQvdCz0YDRg9C30LrQtSDRgdGC0YDQsNC90LjRhtGLXG5cdFx0YWpheCgndGlja2V0cy5waHA/YWN0aW9uPWluaXQnLCAnJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHRlbXBsYXRlSXRlbUxpc3QoZGF0YSwgbGlzdFRpY2tldHNfX2xpc3QpO1xuXHRcdH0pO1xuXG5cdFx0Ly8g0J7QsdC90L7QstC70LXQvdC40LUg0LrQsNC20LTRi9C1IDYwINGB0LXQutGD0L3QtFxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBsaXN0VGlja2V0c19fbGlzdEl0ZW1JZCA9IGxpc3RUaWNrZXRzX19saXN0LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LXRpY2tldHNfX2xpc3QtaXRlbTpsYXN0LWNoaWxkJykgPyBsaXN0VGlja2V0c19fbGlzdC5xdWVyeVNlbGVjdG9yKCcubGlzdC10aWNrZXRzX19saXN0LWl0ZW06bGFzdC1jaGlsZCcpLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpIDogJyc7XG5cblx0XHRcdGFqYXgoJ3RpY2tldHMucGhwP2FjdGlvbj1tb3JlJmlkPScgKyBsaXN0VGlja2V0c19fbGlzdEl0ZW1JZCwgJycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHZhciBjdXJJdGVtc1RydWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC10aWNrZXRzX19saXN0LWl0ZW1bZGF0YS1zdGF0dXM9XCJ0cnVlXCJdJyk7XG5cdFx0XHRcdHZhciBkYXRhSiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdFx0XHRcdHZhciBzdW3QoW9pbmNpZGVuY2UgPSAwO1xuXHRcdFx0XHR2YXIgc3VtSXRlbVRydWUgPSAwO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbDIgPSBkYXRhSi5sZW5ndGg7IGwyID4gajsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFKW2pdLnN0YXR1cyA9PSAndHJ1ZScpIHtcblx0XHRcdFx0XHRcdHN1bUl0ZW1UcnVlKys7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGN1ckl0ZW1zVHJ1ZS5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKGN1ckl0ZW1zVHJ1ZVtpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSA9PSBkYXRhSltqXS5pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHN1bdChb2luY2lkZW5jZSsrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdW3QoW9pbmNpZGVuY2UgIT0gc3VtSXRlbVRydWUpIHtcblxuXHRcdFx0XHRcdGF1ZGlvLmxvYWQoKTtcblx0XHRcdFx0XHRhdWRpby5zcmMgPSAnbm90aWZpY2F0aW9uLm1wMyc7XG5cdFx0XHRcdFx0YXVkaW8udHlwZSA9ICdhdWRpby9tcGVnJztcblx0XHRcdFx0XHRhdWRpby5wbGF5KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0ZW1wbGF0ZUl0ZW1MaXN0KGRhdGEsIGxpc3RUaWNrZXRzX19saXN0KTtcblx0XHRcdH0pO1xuXHRcdH0sIDYwMDAwKTtcblxuXHRcdC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INGC0LjQutC10YLQvtCyINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCw0LrQvdC+0L/QutGDXG5cdFx0aWYgKGxpc3RUaWNrZXRzX19idG5fbG9hZE1vcmUpIHtcblx0XHRcdGxpc3RUaWNrZXRzX19idG5fbG9hZE1vcmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG5cblx0XHRcdFx0dmFyIGxpc3RUaWNrZXRzX19saXN0SXRlbUlkID0gbGlzdFRpY2tldHNfX2xpc3QucXVlcnlTZWxlY3RvcignLmxpc3QtdGlja2V0c19fbGlzdC1pdGVtOmxhc3QtY2hpbGQnKSA/IGxpc3RUaWNrZXRzX19saXN0LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LXRpY2tldHNfX2xpc3QtaXRlbTpsYXN0LWNoaWxkJykuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykgOiAnJztcblx0XHRcdFx0YWpheCgndGlja2V0cy5waHA/YWN0aW9uPW1vcmUmaWQ9JyArIGxpc3RUaWNrZXRzX19saXN0SXRlbUlkLCAnJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR0ZW1wbGF0ZUl0ZW1MaXN0KGRhdGEsIGxpc3RUaWNrZXRzX19saXN0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXHR2YXIgbW9kYWxfX2Nsb3NlID0gZnVuY3Rpb24gbW9kYWxfX2Nsb3NlKGVsKSB7XG5cdFx0dmFyIG1vZGFsX19jbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWwpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsID0gbW9kYWxfX2Nsb3NlLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0bW9kYWxfX2Nsb3NlW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwuYWN0aXZlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bW9kYWxfX2Nsb3NlW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwuYWN0aXZlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0bW9kYWxfX2Nsb3NlKCcubW9kYWxfX2Nsb3NlJyk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIGJ0blRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vcmUtaW5mb19fYnRuLXRvZ2dsZScpO1xuXG5cdGZvciAodmFyIGkgPSAwLCBsID0gYnRuVG9nZ2xlLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdGJ0blRvZ2dsZVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRmb3IgKHZhciBqID0gMCwgbDIgPSBlLnBhdGgubGVuZ3RoOyBsMiA+IGo7IGorKykge1xuXHRcdFx0XHRpZiAoZS5wYXRoW2pdLmNsYXNzTGlzdC5jb250YWlucygnbW9yZS1pbmZvX19pdGVtJykpIHtcblx0XHRcdFx0XHRlLnBhdGhbal0uY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbi8vINCQ0LrRgtC40LLQvdGL0Lkg0L/Rg9C90LrRgiDQvNC10L3RjlxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIGZ1bkFjdGl2ZU1lbnVfX2l0ZW0gPSBmdW5jdGlvbiBmdW5BY3RpdmVNZW51X19pdGVtKGV2ZW50LCBlbCkge1xuXHRcdGZvciAodmFyIGkgPSAwLCBsID0gZWwubGVuZ3RoOyBsID4gaTsgaSsrKSB7XG5cdFx0XHRlbFtpXS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbDIgPSBlbC5sZW5ndGg7IGwyID4gajsgaisrKSB7XG5cdFx0XHRcdFx0ZWxbal0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBfaiA9IDAsIF9sID0gZS5wYXRoLmxlbmd0aDsgX2wgPiBfajsgX2orKykge1xuXHRcdFx0XHRcdGlmIChlLnBhdGhbX2pdLnRhZ05hbWUgPT0gJ0xJJykge1xuXHRcdFx0XHRcdFx0ZS5wYXRoW19qXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBmdW5Ub2dnbGVNZW51X19pdGVtID0gZnVuY3Rpb24gZnVuVG9nZ2xlTWVudV9faXRlbShldmVudCwgZWwpIHtcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGVsLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0ZWxbaV0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ZS50YXJnZXQucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBoZWFkZXJcblx0dmFyIG5hdl9oZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2X2hlYWRlciAubmF2X19saXN0LWl0ZW0nKTtcblx0ZnVuQWN0aXZlTWVudV9faXRlbSgnY2xpY2snLCBuYXZfaGVhZGVyKTtcblx0ZnVuQWN0aXZlTWVudV9faXRlbSgndG91Y2gnLCBuYXZfaGVhZGVyKTtcblxuXHQvLyBzaWRlYmFyIGxlZnRcblx0dmFyIG5hdl9zaWRlYmFyTGVmdF90aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXZfc2lkZWJhci1sZWZ0IC5uYXZfX2xpc3QtaXRlbV90aXRsZScpO1xuXHRmdW5Ub2dnbGVNZW51X19pdGVtKCdjbGljaycsIG5hdl9zaWRlYmFyTGVmdF90aXRsZSk7XG5cdGZ1blRvZ2dsZU1lbnVfX2l0ZW0oJ3RvdWNoJywgbmF2X3NpZGViYXJMZWZ0X3RpdGxlKTtcblxuXHR2YXIgbmF2X3NpZGViYXJMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdl9zaWRlYmFyLWxlZnQgLm5hdl9fbGlzdCAubmF2X19saXN0IC5uYXZfX2xpc3QtaXRlbScpO1xuXHRmdW5BY3RpdmVNZW51X19pdGVtKCdjbGljaycsIG5hdl9zaWRlYmFyTGVmdCk7XG5cdGZ1bkFjdGl2ZU1lbnVfX2l0ZW0oJ3RvdWNoJywgbmF2X3NpZGViYXJMZWZ0KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyDQkNC60YLQuNCy0L3Ri9C5INGC0LjQutC10YJcbihmdW5jdGlvbiAoKSB7XG5cdHZhciBmdW5BY3RpdmVUaWNrZXRzX19pdGVtID0gZnVuY3Rpb24gZnVuQWN0aXZlVGlja2V0c19faXRlbShldmVudCwgZWwpIHtcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGVsLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0ZWxbaV0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDAsIGwyID0gZWwubGVuZ3RoOyBsMiA+IGo7IGorKykge1xuXHRcdFx0XHRcdGVsW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgX2ogPSAwLCBfbCA9IGUucGF0aC5sZW5ndGg7IF9sID4gX2o7IF9qKyspIHtcblx0XHRcdFx0XHRpZiAoZS5wYXRoW19qXS5jbGFzc0xpc3QuY29udGFpbnMoJ3RpY2tldHNfX2xpc3QtaXRlbScpKSB7XG5cdFx0XHRcdFx0XHRlLnBhdGhbX2pdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Ly8gc2lkZWJhciByaWdodFxuXHR2YXIgdGlja2V0c19zaWRlYmFyUmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGlja2V0c19zaWRlYmFyLXJpZ2h0IC50aWNrZXRzX19saXN0LWl0ZW0nKTtcblx0ZnVuQWN0aXZlVGlja2V0c19faXRlbSgnY2xpY2snLCB0aWNrZXRzX3NpZGViYXJSaWdodCk7XG5cdGZ1bkFjdGl2ZVRpY2tldHNfX2l0ZW0oJ3RvdWNoJywgdGlja2V0c19zaWRlYmFyUmlnaHQpO1xufSkoKTsiXX0=
