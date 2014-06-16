$('#login_button').click(function(event)
{
	var memberId = $("#id_memberId").val();
	var memberPw = $("#id_memberPw").val();

	$.post("../login", 
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