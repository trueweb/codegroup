// Активный тикет
(function(){
	let funActiveTickets__item= (event, el)=>{
		for(let i= 0, l= el.length; l > i; i++){
			el[i].addEventListener(event, function(e){
				for(let j= 0, l2= el.length; l2 > j; j++){
					el[j].classList.remove('active');
				}

				for(let j= 0, l= e.path.length; l > j; j++){
					if( e.path[j].classList.contains('tickets__list-item') ){
						e.path[j].classList.add('active');
						break;
					}
				}
			});
		}
	}

	// sidebar right
	let tickets_sidebarRight= document.querySelectorAll('.tickets_sidebar-right .tickets__list-item');
	funActiveTickets__item('click', tickets_sidebarRight);
	funActiveTickets__item('touch', tickets_sidebarRight);

})();