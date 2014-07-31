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
	memberId = "test_id";
	pw = "test_pw_modify";
	memberName = "test_name_modify";
	type = "1";

	$.post("./memberModify",
			{ 
		memberId: memberId,
		pw: pw,
		memberName: memberName,
		type: type
			},
			function(data)
			{
				console.log(data);
			});
};

function memberSearch() 
{
	memberId = "test_id";

	$.post("./memberSearch",
			{ 
		memberId: memberId,
			},
			function(data)
			{
				jData = JSON.parse(data);
			});
};

function memberDelete() 
{
	memberId = "test_id";

	$.post("./memberDelete",
			{ 
		memberId: memberId,
			},
			function(data)
			{
				console.log(data);
			});
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
		if(data == -1)
		{
			alert("ID IS NOT EXIST!");
		}
		
		else if(data == 0)
		{
			alert("CHECK YOUR PASSWORD AGAIN!");
		}
		
		else
		{
			console.log("@@");
			window.location = "./start.jsp";
		}
	});
};


