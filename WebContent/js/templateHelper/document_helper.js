function documentRegister() 
{
	var docTitle = $("#doc_title").val();
	var docEditor = $('[name=doc_editor]').val();
	

	console.log(docTitle);
	console.log(docEditor);
	
	alert(docEditor);
	$.post("./document_add", 
			{ 
				docTitle: docTitle,
				docEditor: docEditor,
			},
			
			function(result) 
			{	
				alert(result);	
				
				window.location = "start.jsp";
	});
};