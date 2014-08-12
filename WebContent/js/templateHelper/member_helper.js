function memberAdd() 
{
	var memberId = $("#memberId").val();
	var pw = $("#memberPw").val();
	var memberName = $("#memberName").val();
	var type = document.querySelector('input[name="memberType"]:checked').value;

	if(type == null){
		type = 0;
	}
	else{
		type = 1;
	}
	$.post("./memberAdd",
			{ 
		memberId: memberId,
		pw: pw,
		memberName: memberName,
		type: type
			},

			function(data)
			{
				window.location = "./main.jsp";
			});
};


function memberModify() 
{
	var memberId = $("#memberId").val();
	var pw = $("#pw").val();
	var memberName = $("#memberName").val();
	var type = document.querySelector('input[name="memberType"]:checked').value;

	$.post("./memberModify",
			{ 
		memberId: memberId,
		pw: pw,
		memberName: memberName,
		type: type
			},

			function(data)
			{
				alert(data);

				//getContJs("user","user");
				window.location = "./start.jsp";
			});
};

function memberSearch() 
{
	getContJs("modify_member","member");

	$.post("./memberSearch",
			{ 

			},
			function(data)
			{
				jData = JSON.parse(data);
				var result = $.parseJSON(jData.memberVO);

				var memberTypeDiv = "";
				
				$("#modify_memberId_div").val(result['memberId']);
				$("#modify_pw_div").val(result['pw']);
				$("#modify_memberName_div").val(result['memberName']);

				if(result['type'] == "0")
				{
					$("#modify_memberType_div").prop("checked", false);
				}
				else
				{
					$("#modify_memberType_div").prop("checked", true);
				}
			});
};

function memberDelete() 
{
	if (confirm("DO YOU WANT TO QUIT DOCKING?") == true)
	{   
		$.post("./memberDelete",
				{ 

				},

				function(data)
				{
					alert(data);

					window.location = "./start.jsp";
				});
	}

	else
	{   
		return;
	}	
};

function memberLogin() 
{
	var memberId = $("#memberId").val();
	var pw = $("#memberPw").val();

	$.post("./memberLogin",
			{ 
		memberId: memberId,
		pw: pw,
			},

			function(data)
			{
				console.log("data : " + data);
				if(data == null)
				{
					alert("LOGIN FAIL");
				}

				else
				{
					/*$("#login_ul").empty();

					$("#login_ul").append('<li><li style="margin:5% -5%">	<div class="btn-group"><button type="button" class="btn btn-theme dropdown-toggle" data-toggle="dropdown"> '+ data +' <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li>MY INFO</a></li><li class="divider"></li><li><a onclick="memberSearch()">UPDATE</a></li><li><a onclick="memberDelete()">DELETE</a></li><li><a onclick="memberLogout()">LOGOUT</a></li></ul></div></li></li></li>');
					*/getContJs("main","member");
				}
			});
};

function memberLogout()
{
	$.post("./memberLogout",
			{ 

			},

			function(data)
			{
				window.location = "./main.jsp";
			});
};