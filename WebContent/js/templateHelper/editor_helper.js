function getOwnEditorList() 
{
	getContJs("list_editor","editor");
	
	$.post("./ownEditorList",
	{ 

	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.EditorVO);
		var editor;
		var editorList = "";
		var editorType = "";

		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorList += '<tr>';
			editorList += '<td><a onclick="editorCodeList(\'' + editor['editorId'] + '\')">' + editor['editorId'] + '</a></td>';
			editorList += '<td class="hidden-phone">' + editor['description'] + '</td>';
			editorList += '<td><a onclick="reviewListByEditor(\'' + editor['editorId'] + '\')">Score : ' + editor['totalScore'] + '</a></td>';
			
			if(editor['editorType'] == "0")
			{
				editorType = "TextEditor";
			}
			
			else if(editor['editorType'] == "1")
			{
				editorType = "MindMap";
			}
			
			else if(editor['editorType'] == "2")
			{
				editorType = "Questionnaire";
			}
			
			else
			{
				editorType = "Else";
			}
			
			editorList += '<td><span class="label label-warning label-mini">' + editorType + '</span></td>';
			editorList += '<td>';
			editorList += '<button class="btn btn-success btn-xs">';
			editorList += '<i class="fa fa-check"></i></button>';
			editorList += '<button class="btn btn-primary btn-xs">';
			editorList += '<i class="fa fa-pencil"></i></button>';
			editorList += '<button class="btn btn-danger btn-xs">';
			editorList += '<i class="fa fa-trash-o "></i></button></td></tr>';

			$("#own_editorList").append(editorList);
			
			editorList = "";
		}
	});
};

$("#editorAddForm").submit(function (event) 
{
    event.preventDefault();
    var formData = new FormData($(this)[0]);

    $.ajax({
        url: './editorAdd',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function () 
        {
        	getContJs("editor","editor");
        },
        error: function()
        {
            alert("error in ajax form submission");
        }
    });

    return false;
});

$(function() {
	$('#local_radio').click(function () {
        $('#shareMode_div').hide('fast');
   });
	
	$('#share_radio').click(function () {
        $('#shareMode_div').show('fast');
   });
 });



function editorModify() 
{
	var editorId = $("#editorId").val();
	var description = $("#description").val();
	var editorType = $("#editorType").val();
	var editorZip = $("#editorZip").val();

	$.post("./editorModify",
			{ 
				editorId: editorId,
				description: description,
				editorType: editorType,
				editorZip: editorZip
			},

			function(data)
			{
				alert(data);

				window.location = "./start.jsp";
			});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function reviewListByWriter() 
{
	getContJs("editor_review","editor");

	$.post("./reviewListByWriter",
	{ 
		
	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.developerReviewList);
		var total;
		var totalList = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			total = $.parseJSON(result[i]);
			
			totalList += '<div class="record">';
			totalList += '<div class="bar" style="width:' + total['totalScore'] + '%;">';
			totalList += '<span><a onclick="reviewListByEditor(\'' + total['editorId'] + '\')">' + total['editorId'] + '</a></span></div><div class="p">';
			totalList += '<span>Score : ' + total['totalScore'] + '</span></div></div>';
			
			
			
			if(result['editorType'] == "0")
			{
				$("#textEditor_div").append(totalList);
			}
			
			else if(result['editorType'] == "1")
			{
				$("#mindMap_div").append(totalList);
			}
			
			else if(result['editorType'] == "2")
			{
				$("#question_div").append(totalList);
			}
			
			else
			{
				$("#else_div").append(totalList);
			}
			
			totalList = "";
		}
	});
};

function reviewListByEditor(editorId) 
{
	getContJs("list_review","editor");
	
	$.post("./reviewListByEditor",
	{ 
		editorId : editorId
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
			
			reviewList += '</div></div></div> <br>';		
			
			$("#reviewList_div").append(reviewList);
			
			reviewList = "";
		}
	});
};

function getEditorList() 
{
	getContJs("editor_own","editor");

	$.post("./ownEditorList",
	{ 

	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.EditorVO);
		var editor;
		var editorList = "";
		var editorType = "";

		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorList += '<li class="own_editorList_li">';
			editorList += '<a onclick="editorCodeList(\'' + editor['editorId'] + '\')">';
			editorList += '<h2 class="own_editorList_h2">' + editor['editorId'] + '</h2>';
			
			if(editor['editorType'] == "0")
			{
				editorType = "TextEditor";
			}
			
			else if(editor['editorType'] == "1")
			{
				editorType = "MindMap";
			}
			
			else if(editor['editorType'] == "2")
			{
				editorType = "Questionnaire";
			}
			
			else
			{
				editorType = "Else";
			}
			
			editorList += '<p class="own_editorList_p">' + editorType + '</p>';
			editorList += '</a></li>';

			$("#own_editorList").append(editorList);
			
			editorList = "";
		}
	});
};

function editorCodeList(editorId)
{
	getContJs("editor_manage","editor");

	$.post("./codeList",
	{ 
		editorId : editorId
	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorReviewBBSVO);
		var editor;
		var editorList = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorList += '<li>';
			editorList += '<a onclick="editorCodeList(' + editor['editorId'] + ')">';
			editorList += '<h2>' + editor['editorId'] + '</h2>';
			editorList += '<p>' + editor['description'] + '</p>';
			editorList += '</a></li>';

			$("#own_editorList").append(editorList);
			
			editorList = "";
		}
	});
}