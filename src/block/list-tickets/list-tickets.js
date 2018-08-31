(function(){
	let listTickets__btn_loadMore= document.getElementById('list-tickets__btn_load-more');
	let listTickets__list= document.getElementById('list-tickets__list');
	let audio= new Audio();

	let templateItem= (data)=>{
		return `<div class="list-tickets__list-item ${ data.status == "true" ? "" : "list-tickets__list-item_disabled" }" data-status="${ data.status }" data-id="${ data.id }">
							<div class="list-tickets__col list-tickets__col_time">
								<div class="list-tickets__time">
									${ moment.unix(data.timestamp).format('hh:mm') } <br> ${ moment.unix(data.timestamp).format('MMM DD') }
								</div>
							</div>
							<div class="list-tickets__list-item-box list-tickets__list-item-box_center">
								<div class="list-tickets__list-item-box-row list-tickets__list-item-box-row_1">
									<div class="list-tickets__list-item-col list-tickets__list-item-col_type">
										<div class="list-tickets__type">
											${ data.type }
										</div>
									</div>
									<div class="list-tickets__list-item-col list-tickets__list-item-col_ticket">
										<div class="list-tickets__ticket">
											<div class="list-tickets__ticket-box-img"><img class="list-tickets__ticket-img" src="img/${ data.imgAvatar }" alt="" role="presentation">
											</div>
											<div class="list-tickets__ticket-box-text">
												<div class="list-tickets__ticket-text list-tickets__ticket-text_name">${ data.ticketName }
												</div>
												<div class="list-tickets__ticket-text list-tickets__ticket-text_user">${ data.ticketUser }
												</div>
											</div>
										</div>
									</div>
									<div class="list-tickets__list-item-col list-tickets__list-item-col_conditions">
										<div class="list-tickets__conditions">${ data.conditions }
										</div>
									</div>
								</div>
								<div class="list-tickets__list-item-box-row list-tickets__list-item-box-row_2">
									<div class="list-tickets__list-item-col list-tickets__list-item-col_text">
										<div class="list-tickets__text">
											${ data.text }
										</div>
									</div>
								</div>
							</div>
							<div class="list-tickets__list-item-col list-tickets__list-item-col_view"><a class="list-tickets__btn list-tickets__btn_go-to btn btn_regular" href="#">Перейти</a>
							</div>
						</div>`
	}

	let templateItemList= (data, el)=>{
		if(data){
			let dataJ= JSON.parse( data );
			let templateArr= [];
			for(let i= 0, l= dataJ.length; l > i; i++){
				templateArr.push( templateItem(dataJ[i]) );
			}
			el.innerHTML= templateArr.join(' ');
		}
	}
	
	if(listTickets__list){

		// Список тикетов при зангрузке страницы
		ajax('tickets.php?action=init', '', function(data){
			templateItemList(data, listTickets__list);
		});

		// Обновление каждые 60 секунд
		setInterval(function(){
			let listTickets__listItemId= listTickets__list.querySelector('.list-tickets__list-item:last-child') ? listTickets__list.querySelector('.list-tickets__list-item:last-child').getAttribute('data-id') : '';


			ajax('tickets.php?action=more&id=' + listTickets__listItemId, '', function(data){
				let curItemsTrue= document.querySelectorAll('.list-tickets__list-item[data-status="true"]');
				let dataJ= JSON.parse( data );
				let sumСoincidence= 0;
				let sumItemTrue= 0;
				for(let j= 0, l2= dataJ.length; l2 > j; j++){
					if( dataJ[j].status == 'true' ){
						sumItemTrue++;
						for(let i= 0, l= curItemsTrue.length; l > i; i++){
							if(curItemsTrue[i].getAttribute('data-id') == dataJ[j].id){
								sumСoincidence++;
							}
						}
					}
				}
				if(sumСoincidence != sumItemTrue){

					audio.load();
					audio.src= 'notification.mp3';
					audio.type= 'audio/mpeg';
					audio.play();
				}

				templateItemList(data, listTickets__list);
			});
		}, 60000)



		// Добавление тикетов при нажатии накнопку
		if( listTickets__btn_loadMore ){
			listTickets__btn_loadMore.addEventListener("click", function(e){

				let listTickets__listItemId= listTickets__list.querySelector('.list-tickets__list-item:last-child') ? listTickets__list.querySelector('.list-tickets__list-item:last-child').getAttribute('data-id') : '';
					ajax('tickets.php?action=more&id=' + listTickets__listItemId, '', function(data){
						templateItemList(data, listTickets__list);
					});

			})
		}
	}


})();