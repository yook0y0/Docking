$('#modify_button').click(function(event)
{
	var memberId = $("#modify_memberId").val();
	var memberPw = $("#modify_memberPw").val();
	var memberNickName = $("#modify_memberNickName").val();
	var memberType = document.querySelector('input[name="memberType"]:checked').value;
	
	$.post("../member_modify", 
			{ 
				memberId: memberId,
				memberPw: memberPw,
				memberNickName: memberNickName,
				memberType: memberType,
			},
			
			function(result) 
			{	
				alert(result);	
				
				window.location = "start.jsp";	
			}
	);
});

$('#delete_button').click(function(event)
{
	var memberId = $("#modify_memberId").val();
	var con = confirm("Do you really want to quit docking?");
 	
	if(con == true)
	{
		$.post("../member_delete", 
				{ 
					memberId: memberId,
				},
				
				function(result) 
				{	
					alert(result);	
					
					window.location = "start.jsp";	
				}
		);
 	}
	
	else{}
});