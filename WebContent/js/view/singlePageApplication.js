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
	
	$('head').append('<link rel="stylesheet" type="text/css" href="assets/css/tree.css" />');
	$('head').append('<link rel="stylesheet" href="codemirror-4.4/lib/codemirror.css"/>');
	$('head').append('<script src="codemirror-4.4/lib/codemirror.js"></script>');
	$('head').append('<script src="codemirror-4.4/mode/javascript/javascript.js"></script>');
	$('head').append('<script src="codemirror-4.4/mode/scheme/scheme.js"></script>');
	$('head').append('<script src ="http://code.jquery.com/jquery-1.7.js"></script>');
};
