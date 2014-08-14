

var tree_menu = $('#tree_menu');
var icon_open = 'assets/img/folder-closed.png';
var icon_close = 'assets/img/open-folder.png';

tree_menu.find('li:has("ul")').prepend('<a href="#" class="control"><img src="' + icon_close + '" /></a> ');
tree_menu.find('li:last-child').addClass('end');

$('.control').click(function(){
	var temp_el = $(this).parent().find('>ul');
	if (temp_el.css('display') == 'none'){
		temp_el.slideDown(100);
		$(this).find('img').attr('src', icon_close);
		return false;
	} else {
		temp_el.slideUp(100);
		$(this).find('img').attr('src', icon_open);
		return false;
	}
});

function tree_init(status){
	if (status == 'close'){
		tree_menu.find('ul').hide();
		$('a.control').find('img').attr('src', icon_open);
	} else if (status == 'open'){
		tree_menu.find('ul').show();
		$('a.control').find('img').attr('src', icon_close);
	}
}

tree_init('close');

$('#all').toggle(function(){
	tree_init('open');
	$(this).text('ALL CLOSE');
},function(){
	tree_init('close');
	$(this).text('ALL OPEN');
});

$('ul#tree_menu li a').click(function() {
	if($(this).text().length != 0){
		$('#codeName').html($(this).text());
		$.ajax({
			data: "fileName="+ $(this).text(),
			contentType: "application/json; charset=utf-8",
			traditional: true,
			url: "openFile",
			success:function(data){ 
				updateCode(data); 
			} 

		});
	}
});

var editor;

$(document).ready(function() {
	editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		mode: "scheme",
		lineNumbers: true
	});
	
	var pending;
	editor.on("change", function() {
		clearTimeout(pending);
		pending = setTimeout(update, 400);
	});
	
	function looksLikeScheme(code) {
		return !/^\s*\(\s*function\b/.test(code) && /^\s*[;\(]/.test(code);
	}
	
	function update() {
		editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme" : "javascript");
	}

});

function updateCode(data) {
	editor.setValue(data.code);
}	

//});

