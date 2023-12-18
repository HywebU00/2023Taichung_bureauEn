function rwdTable(){	
	$('.list').find('table').each(function(){
		var $row = $(this).find('tr');
		rowCount = $row.length;
		for ( var n=1; n<=rowCount ; n++ ) {
			$(this).find('th').each(function(index) {
				var thText = $(this).text();
				$row.eq(n).find('td').eq(index).attr('data-title', thText);
			});
		}
	});
}
