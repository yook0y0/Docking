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
	var pw = $("#memberPw").val();
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
		
		$( "#changeable_inside" ).load( "js/templates/user_template");
	});
};

function memberSearch() 
{
	$( "#changeable_inside" ).load( "js/templates/user_update_template.html");
	$.getScript('js/templateHelper/user_helper.js');
	
	$.post("./memberSearch",
	{ 
		memberId: memberId,
	},
	function(data)
	{
		jData = JSON.parse(data);
		
		alert(jData);
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


