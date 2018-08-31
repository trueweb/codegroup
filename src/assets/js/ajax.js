let ajax= (url, data, callback)=>{
	let cb= callback || function(){};
	let xhr= new XMLHttpRequest();
	xhr.open('POST', url, false);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(data);
	return (xhr.onreadystatechange= ()=>{
		if(xhr.readyState == 4 && xhr.status == 200){
			if(xhr.responseText != '')
			return cb( xhr.responseText );
		}else{
			console.log('err');	
		}
	})()
}