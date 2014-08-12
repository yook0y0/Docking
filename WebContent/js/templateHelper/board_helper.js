function getReviewList()
{
	getContJs("list_review","board");
	
	$.post("./reviewList",
	{ 

	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorReviewBBSVO);
		var review;
		var reviewList = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			review = $.parseJSON(result[i]);
			
			reviewList += '<div class="weather-2 pn">';
			reviewList += '<div class="weather-2-header">';
			reviewList += '<div class="row">';
			reviewList += '<div class="col-sm-6 col-xs-6">';
			reviewList += '<p>' + review['reviewId'] + '</p>';
			reviewList += '</div>';
			reviewList += '<div class="col-sm-6 col-xs-6 goright">';
			reviewList += '<p class="small">' + review['writtenDate'] + '</p>';
			reviewList += '</div></div></div>';
			reviewList += '<div class="row data"> <br>';
			reviewList += '<div class="col-sm-6 col-xs-6 goleft">' + review['body'] + '</div>';
			reviewList += '<div class="col-sm-6 col-xs-6 goright"> <br>';
			reviewList += '<h4><b>' + review['editorId'] + '</b></h4>';
			reviewList += '<h4><b> Score : ' + review['score'] + '</b></h4>';
			
			if(review['logInMember'] == review['memberId'])
			{
				reviewList += '<button class="btn btn-primary btn-xs" onclick="reviewSearch(\'' + review['reviewId'] + '\')">';
				reviewList += '<i class="fa fa-pencil"></i></button>';
				reviewList += '<button class="btn btn-danger btn-xs" onclick="reviewDelete(\'' + review['reviewId'] + '\')">';	
				reviewList += '<i class="fa fa-trash-o "></i></button>';
			}

			reviewList += '</div></div></div> <br>';		
			
			$("#reviewList_div").append(reviewList);
			
			reviewList = "";
		}
	});
};

function showValue(newValue)
{
	document.getElementById("range").innerHTML=newValue;
}

function reviewEditorSearch()
{
	getContJs("add_board","board");

	$.post("./editorSearchAll",
	{ 
		
	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorVO);
		var editor;
		var editorOption = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorOption += '<option value="' + editor['editorId'] + '">' + editor['editorId'] + '</option>';
			
			if(editor['editorType'] == "0")
			{
				$("#textEditor").append(editorOption);
			}
			
			else if(editor['editorType'] == "1")
			{
				$("#mindMap").append(editorOption);
			}
			
			else if(editor['editorType'] == "2")
			{
				$("#questionnaire").append(editorOption);
			}
			
			else if(editor['editorType'] == "3")
			{
				$("#elseEditor").append(editorOption);
			}
			
			editorOption = "";
		}
	});
}

function reviewAdd() 
{
	var editorId = $('[name=doc_editor]').val();
	var score = $("#score").val();
	var body = $("#review").val();

	$.post("./reviewAdd",
	{ 
		editorId: editorId,
		score: score,
		body: body
	},
	
	function(data)
	{
		alert("SUCCESS!");
			
		getReviewList();
	});
};

function reviewSearch(reviewId) 
{
	getContJs("modify_board","board");

	$.post("./reviewSearch",
	{ 
		reviewId: reviewId
	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorReviewBBSVO);
		
		var reviewIdDiv = "";
		var editorIdDiv = "";
		var memberIdDiv = "";
		var bodyDiv = "";
		var scoreDiv = "";
		
		reviewIdDiv += '<input type="hidden" class="form-control" id="reviewId" name="reviewId" value="' + result['reviewId'] + '">';
		editorIdDiv += 'editor : <input type="text" class="form-control" id="editorId" name="editor" value="' + result['editorId'] + '" readonly> <br>';
		memberIdDiv += 'writer : <input type="text" class="form-control" id="memberId" name="writer" value="' + result['memberId'] + '" readonly> <br>';
		bodyDiv += 'review : <input type="text" class="form-control" id="body" name="review" value="' + result['body'] + '"> <br>';
		scoreDiv += 'score : <span id="range">' + result['score'] + '</span>';
		scoreDiv += '<input type="range"  min="0" max="10" class="form-control input-lg" id="score" name="score" onchange="showValue(this.value)"  value="' + result['score'] + '"> <br>';
		
		$("#reviewId_div").append(reviewIdDiv);
		$("#editorId_div").append(editorIdDiv);
		$("#memberId_div").append(memberIdDiv);
		$("#body_div").append(bodyDiv);
		$("#score_div").append(scoreDiv);
	});
};

function reviewModify() 
{
	var reviewId = $("#reviewId").val();
	var editorId = $("#editorId").val();
	var memberId = $("#memberId").val();
	var body = $("#body").val();
	var score = $("#score").val();

	$.post("./reviewModify",
	{ 
		reviewId: reviewId,
		editorId: editorId,
		memberId: memberId,
		body: body,
		score: score
	},
	
	function(data)
	{
		alert("SUCCESS!");
		
		getReviewList();
	});
};

function modifyCancle()
{
	getReviewList();
};

function reviewDelete(reviewId)
{
	if (confirm("DO YOU WANT TO DELETE REVEIW?") == true)
	{   
		$.post("./reviewDelete",
		{ 
			reviewId : reviewId
		},
		
		function(data)
		{
			alert("DELETE SUCCESS!");
			
			getReviewList();
		});
	}
	
	else
	{   
	    return;
	}	
};