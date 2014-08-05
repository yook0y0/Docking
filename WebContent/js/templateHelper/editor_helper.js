function editorAdd() 
{
	var editorId = $("#editorId").val();
	var director = $("#director").val();
	var description = $("#description").val();
	var editorType = $("#editorType").val();
	
	$.post("./editorAdd",
	{ 
		editorId: editorId,
		director: director,
		description: description,
		editorType: editorType
	},
	
	function(data)
	{
		alert(data);
		
		window.location = "./start.jsp";
	});
};

function editorModify() 
{
	var editorId = $("#editorId").val();
	var director = $("#director").val();
	var description = $("#description").val();
	var editorType = $("#editorType").val();
	
	$.post("./editorModify",
	{ 
		editorId: editorId,
		director: director,
		description: description,
		editorType: editorType
	},
	
	function(data)
	{
		alert(data);
		
		window.location = "./start.jsp";
	});
};