$('#invite_button').click(function(event)
{
	$.post("../member_searchAll", 
			{ 
				memberId: memberId,
				memberPw: memberPw,
			},
			
			function(result) 
			{	
				alert(result);	
				
				window.location = "start.jsp";
				
				/*if(result == "LOGIN SUCCESS!")
				{
					window.location = "start.jsp";
				}
				
				else
				{
					window.location = "login.jsp";
				}*/
			}
	);
});