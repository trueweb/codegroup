(function(){
	let btnToggle= document.getElementsByClassName('more-info__btn-toggle');

	for(let i= 0, l= btnToggle.length; l > i; i++){
		btnToggle[i].addEventListener('click', function(e){
			for(let j= 0, l2= e.path.length; l2 > j; j++){
				if( e.path[j].classList.contains('more-info__item')){
					e.path[j].classList.toggle('active');
					break;
				}
			}
		});
	}
	
})();