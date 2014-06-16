$('#register_button').click(function(event)
{
	var memberId = $("#id_memberId").val();
	var memberPw = $("#id_memberPw").val();
	var memberNickName = $("#id_memberNickName").val();
	var memberType = document.querySelector('input[name="memberType"]:checked').value;;
	
	$.post("../member_add", 
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