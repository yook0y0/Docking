function memberAdd() {

	memberId = "test_id";
	pw = "test_pw";
	memberName = "test_name";
	type = "0";

	$.post("./memberAdd",
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

function memberModify() {

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

function memberSearch() {

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

function memberDelete() {

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