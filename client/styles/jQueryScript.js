jQuery(document).ready(function(){ 
	$(document).on('mouseover', 'input', function(){
		jQuery(this).focus(); 
	})
	$(document).on('click', '.addTrans', function(){
		jQuery('.new-transaction').slideToggle('slow'); 
	});
	$(document).on('click', '.addFile', function(){
		jQuery('.myFileInput').slideToggle('slow'); 
	});
	$(document).on('click', '.viewStats', function(){
		jQuery('.statsTable').slideToggle('slow'); 
	});
	$(document).on('click', '.viewTransTable', function(){
		jQuery('.transTable, #NoResults').slideToggle('slow'); 
	}); 
	$(document).on('click', '.searchSort', function(){
		jQuery('#sortField, #searchBox').slideToggle('fast');
	}); 
});