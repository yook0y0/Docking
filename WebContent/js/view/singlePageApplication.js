function getCont( url )
{	
	$( "#changeable_inside" ).load( "js/templates/"+url +"_template.html");
};

function getContJs( template , script )
{	
	$( "#changeable_inside" ).load( "js/templates/"+ template +"_template.html");
	$.getScript('js/templateHelper/'+ script + '_helper.js');
};

function getContJsCss( template , script )
{	
	$( "#changeable_inside" ).load( "js/templates/"+ template +"_template.html");
	$.getScript('js/templateHelper/'+ script + '_helper.js');
	$('head').append('<script src ="http://code.jquery.com/jquery-1.7.js"></script>');
	$('head').append('<link rel="stylesheet" href="CodeMirror-master/lib/codemirror.css"/>');
	$('head').append('<link rel="stylesheet" href="assets/css/tree.css"/>');
	$('head').append('<script src="CodeMirror-master/lib/codemirror.js"></script>');
	$('head').append('<script src="CodeMirror-master/mode/javascript/javascript.js"></script>');
	$('head').append('<script src="CodeMirror-master/mode/scheme/scheme.js"></script>');
};
