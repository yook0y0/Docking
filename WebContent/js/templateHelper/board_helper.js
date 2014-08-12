$(document).ready(function() 
{
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
			
			reviewList += '<li class="event">';
			reviewList += '<input type="radio" id="' + review['reviewId'] + '" name="tl-group" value="' + review['reviewId'] + '"/>';
			reviewList += '<label></label>';
			reviewList += '<div class="thumb user-6"><span>' + review['memberId'] + review['writtenDate'] + '</span></div>';
			reviewList += '<div class="content-perspective">';
			reviewList += '<div class="content">';
			reviewList += '<div class="content-inner">';
			reviewList += '<h3>' + review['editorId'] + ':' + review['score'] + '</h3>';
			reviewList += '<p>' + review['body'] + '</p>';
			
			if(1)
			{
				reviewList += '<p><a onclick="reviewSearch()">MODIFY</a></p>';
				reviewList += '&nbsp&nbsp&nbsp';	
				reviewList += '<p><a onclick="reviewDelete()">DELETE</a></p>';	
			}
			
			reviewList += '</div>';
			reviewList += '</div>';
			reviewList += '</div>';
			reviewList += '</li>';
			
			$("#reviewList_ul").append(reviewList);
			
			reviewList = "";
		}
	});
});

function showValue(newValue)
{
	document.getElementById("range").innerHTML=newValue;
}

function reviewEditorSearch()
{
	getContJs("board_regist","board");

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
			
		getContJs("board_list","board");
	});
};

function reviewSearch() 
{
	getContJs("board_update","board");
	
	var reviewId = $('input:radio[name="tl-group"]:checked').val();
	
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
		alert(data);
		
		getContJs("board_list","board");
	});
};

function modifyCancle()
{
	getContJs("board_list","board");
};

function reviewDelete()
{
	if (confirm("DO YOU WANT TO DELETE REVEIW?") == true)
	{   
		var reviewId = $('input:radio[name="tl-group"]:checked').val();

		$.post("./reviewDelete",
		{ 
			reviewId : reviewId
		},
		
		function(data)
		{
			alert("DELETE SUCCESS!");
			
			getContJs("board_list","board");
		});
	}
	
	else
	{   
	    return;
	}	
};