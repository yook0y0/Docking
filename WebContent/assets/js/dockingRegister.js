$('#docking_register').click(function(event)
{
	var con = confirm("Do you want to create dockingEnvironment?");
 	
	if(con == true)
	{
		var writer = $("#writer").val();
		$.post("../dockingEnvironment_add", 
				{ 
					writer : writer
				},
				
				function(result) 
				{	
					alert(result);	
					
					window.location = "dockingEnvironment.jsp";	
				}
		);
 	}
});