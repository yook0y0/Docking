var editor_id = "";
var editor;
function load_tree(editorId) {
	editor_id += editorId;
	var tree_menu = $('#tree_menu');
	var icon_open = 'assets/img/tree_close.gif';
	var icon_close = 'assets/img/tree_open.gif';

	tree_menu.find('li:has("ul")')
			.prepend(
					'<a href="#" class="control"><img src="' + icon_close
							+ '" /></a> ');
	tree_menu.find('li:last-child').addClass('end');

	$('.control').click(function() {
		var temp_el = $(this).parent().find('>ul');
		if (temp_el.css('display') == 'none') {
			temp_el.slideDown(100);
			$(this).find('img').attr('src', icon_close);
			return false;
		} else {
			temp_el.slideUp(100);
			$(this).find('img').attr('src', icon_open);
			return false;
		}
	});
	function tree_init(status) {
		if (status == 'close') {
			tree_menu.find('ul').hide();
			$('a.control').find('img').attr('src', icon_open);
		} else if (status == 'open') {
			tree_menu.find('ul').show();
			$('a.control').find('img').attr('src', icon_close);
		}
	}

	tree_init('close');

	var textArea = document.getElementById('code');
	editor = CodeMirror.fromTextArea(textArea, {
		lineNumbers : true,
		matchBrackets : true
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
		editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme"
				: "javascript");
	}

	$('#all').toggle(function() {
		tree_init('open');
		$(this).text('ALL CLOSE');
	}, function() {
		tree_init('close');
		$(this).text('ALL OPEN');
	});

	
}
function sendPathToOpenDocument(file_path)
{
	console.log("editorCode:"+file_path);
	if ((file_path.length != 0) && (file_path.search(".") != -1)) {
		if (file_path.search(".png") != -1
				|| file_path.search(".jpg") != -1) {
			alert("sorry!! we can't not open image file.");
			return;
		}
		var fileName = file_path.split('\\');
		
		$.post("./editorCodeSearch", {
			editorId : editor_id,
			path : file_path,
		},
		function(data) {
			jData = JSON.parse(data);
			var editorCodeDataJson = $.parseJSON(jData.editorCodeVO);
			updateCode(editorCodeDataJson['code']);
			$('#codeName').html(fileName[fileName.length-1]);
			$('#full_path').val(editorCodeDataJson['path']);
		});				
		}
}
function deleteCode()
{
	var _path = $('#full_path').val();
	
	if (confirm("DO YOU WANT TO DELETE \'" + _path + "\'?") == true)
	{   
		$.post("./editorCodeDelete",
		{ 
			path : _path
		},

		function(data)
		{
			var twiceSlashStr = _path.replace(/\\/g,'\\\\');
			document.getElementById(twiceSlashStr).innerHTML = "";
			$('#codeName').html('');
			updateCode('');
			alert("정상적으로 삭제되었습니다.");
		});
	}

	else
	{   
		return;
	}
}

function createNewDocument(newpath) 
{ 
	
	$.post("./editorCodeAdd", {
		path : editor_id+'\\'+newpath,
		code : "",
		editorId : editor_id
	},

	function(data) {
		$('#tree_menu').append('<li><a onclick="sendPathToOpenDocument(\'' + newpath + '\')">'+newpath+'</a><ul></ul></li>');
		$('#full_path').val(newpath);
		$('#codeName').html(newpath);
		updateCode('');
		alert("write code and save please");
	});
 
} 

function createPopUp(file)
{
	popupWindow = window.open(
		'js/templates/'+file+'_template.html','popUpWindow','height=300,width=350,left=100,top=20,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no');
}
function updateCode(str) {
	editor.setValue(str);
}
function getCode() {
	var new_code = editor.getValue();
	var _path = $('#full_path').val();
	$.post("./editorCodeModify", {
		editorId : editor_id,
		path : _path,
		code : new_code,
	},

	function(data) {
		alert("save success!!lol!!");
	});
}