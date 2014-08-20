function memberAdd() 
{
	var memberId = $("#memberId").val();
	var pw = $("#memberPw").val();
	var memberName = $("#memberName").val();
	var type = document.querySelector('input[name="memberType"]:checked').value;

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

		window.location = "./main.jsp";
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

		var	memberIdDiv = "";
		var memberPwDiv = "";
		var memberNameDiv = "";
		var memberTypeDiv = "";
		
		memberIdDiv += '<h5>EMAIL</h5>';
		memberIdDiv += '<input type="text" class="form-control input-lg" id="memberId" value ="' + result['memberId'] + '" readonly> <br>';
		
		memberPwDiv += '<h5>PASSWORD</h5>';
		memberPwDiv += '<input type="text" class="form-control input-lg" id="pw" name="memberPw" value="' + result['pw'] + '"> <br>';
		
		memberNameDiv += '<h5>NICKNAME</h5>';
		memberNameDiv += '<input type="text" class="form-control input-lg" id="memberName" name="memberName" value="' + result['memberName'] + '"> <br>';
		
		if(result['type'] == "0")
		{
			memberTypeDiv += '<input type="radio" name="memberType" value="0" checked> User'; 
			memberTypeDiv += '&nbsp; &nbsp';
			memberTypeDiv += '<input type="radio" name="memberType" value="1"> Developer &nbsp; &nbsp; <br>';
		}
		else
		{
			memberTypeDiv += '<input type="radio" name="memberType" value="0"> User'; 
			memberTypeDiv += '&nbsp; &nbsp';
			memberTypeDiv += '<input type="radio" name="memberType" value="1" checked> Developer &nbsp; &nbsp; <br>';
		}
		
		$("#modify_memberId_div").append(memberIdDiv);
		$("#modify_pw_div").append(memberPwDiv);
		$("#modify_memberName_div").append(memberNameDiv);
		$("#modify_memberType_div").append(memberTypeDiv);
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
			alert("DELETE COMPLETE");

			window.location = "./main.jsp";
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
		pw: pw
	},

	function(data)
	{
		if(data == "-1")
		{
			alert("NO ID");
		}
		
		else if(data == "0")
		{
			alert("PASSWORD ERROR!");
		}

		else
		{
			window.location = "./main.jsp";
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