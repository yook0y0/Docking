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
		window.location = "./start.jsp";
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
	getContJs("user_update","user");
	
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
		
		memberIdDiv += 'ID : <input type="email" class="form-control" id="memberId" name="memberId" value="' + result['memberId'] + '" readonly> <br>';
		memberPwDiv += 'PW : <input type="text" class="form-control" id="pw" name="memberPw" value="' + result['pw'] + '"> <br>';
		memberNameDiv += 'NICKNAME : <input type="text" class="form-control" id="memberName" name="memberNickName" value="' + result['memberName'] + '"> <br>';
		
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
	console.log("memberLogin");
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
		if(data == "-1")
		{
			alert("ID IS NOT EXIST!");
		}
		
		else if(data == "0")
		{
			alert("CHECK YOUR PASSWORD AGAIN!");
		}
		
		else
		{
			window.location = "./start.jsp";
		}
	});
};


