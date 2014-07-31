function getCont( url )
{	
	$( "#changeable_inside" ).load( "js/templates/"+url +"_template.html");
}
function getContJs( template , script )
{	
	$( "#changeable_inside" ).load( "js/templates/"+ template +"_template.html");
	$.getScript('js/templateHelper/'+ script + '_helper.js');
}