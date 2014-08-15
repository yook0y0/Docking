function editorAdd()
{
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
	        	getOwnEditorList();
	        },
	        error: function()
	        {
	            alert("error in ajax form submission");
	        }
	    });

	    return false;
	});
};

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

		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorList += '<tr>';
			editorList += '<td><a onclick="getCodeList(\'' + editor['editorId'] + '\')">' + editor['editorId'] + '</a></td>';
			editorList += '<td class="hidden-phone">' + editor['description'] + '</td>';
			editorList += '<td><a onclick="reviewListByEditor(\'' + editor['editorId'] + '\')">Score : ' + editor['totalScore'] + '</a></td>';
			
			if(editor['editorType'] == "0")
			{
				editorList += '<td><span class="label label-warning label-mini">TextEditor</span></td>';
			}
			
			else if(editor['editorType'] == "1")
			{
				editorList += '<td><span class="label label-primary label-mini">MindMap</span></td>';
			}
			
			else if(editor['editorType'] == "2")
			{
				editorList += '<td><span class="label label-success label-mini">Questionnaire</span></td>';
			}
			
			else
			{
				editorList += '<td><span class="label label-default label-mini">Else</span></td>';

			}
			
			
			editorList += '<td>';
			editorList += '<button class="btn btn-success btn-xs">';
			editorList += '<i class="fa fa-check"></i></button>';
			editorList += '<button class="btn btn-primary btn-xs" onclick="editorSearch(\'' + editor['editorId'] + '\')">';
			editorList += '<i class="fa fa-pencil"></i></button>';
			editorList += '<button class="btn btn-danger btn-xs" onclick="editorDelete(\'' + editor['editorId'] + '\')">';
			editorList += '<i class="fa fa-trash-o "></i></button></td></tr>';

			$("#own_editorList").append(editorList);
			
			editorList = "";
		}
	});
};

function closeShareMode()
{
	$('#shareMode_div').hide('fast');
};

function openShareMode()
{
	$('#shareMode_div').show('fast');
};

function selectTextEditor()
{
	$("#editorType").val("0");
};

function selectMindMap()
{
	$("#editorType").val("1");
};

function selectQuestionnaire()
{
	$("#editorType").val("2");
};

function selectElse()
{
	$("#editorType").val("3");
};

function registerCancle()
{
	getOwnEditorList();
};

function editorSearch(editorId)
{
	getContJs("modify_editor","editor");
	
	$.post("./editorSearch",
	{ 
		editorId: editorId
	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.modifyEditorVO);
		
		var editorIdDiv = "";
		var descriptionDiv = "";
		var startPageDiv = "";
		var setMethodDiv = "";
		var getMethodDiv = "";
		var useRangeDiv = "";
		var editorTypeDiv = "";
		var buttonDiv = "";
		
		editorIdDiv += '<input type="name" name="editorId" class="form-control" id="editorId" placeholder="editor Name" value ="' + result['editorId'] + '"> <br>';
		descriptionDiv += '<input type="name" name="description" class="form-control" id="description" placeholder="description" value ="' + result['description'] + '"> <br>';
		startPageDiv += '<input type="name" name="startPage" class="form-control" id="startPage" placeholder="startPage" value ="' + result['startPage'] + '"> <br>';
		setMethodDiv += '<input type="name" name="setMethod" class="form-control" id="setMethod" placeholder="setMethod" value ="' + result['setMethod'] + '"> <br>';
		getMethodDiv += '<input type="name" name="getMethod" class="form-control" id="getMethod" placeholder="getMethod" value ="' + result['getMethod'] + '"> <br>';
		editorTypeDiv += '<input type="hidden" id="editorType" name="editorType" value ="' + result['editorType'] + '">';
		
		if(result['useRange'] == "0")
		{
			useRangeDiv += '<input type="radio" id="local_radio" name="useRange" value="0" checked onclick="closeShareMode()"> Limit';
			useRangeDiv += '<input type="radio" id="share_radio" name="useRange" value="1" onclick="openShareMode()"> Permission &nbsp; &nbsp; <br>';

			$('#shareMode_div').hide('fast');
		}
		else
		{
			useRangeDiv += '<input type="radio" id="local_radio" name="useRange" value="0" onclick="closeShareMode()"> Limit';
			useRangeDiv += '<input type="radio" id="share_radio" name="useRange" value="1" checked onclick="openShareMode()"> Permission &nbsp; &nbsp; <br>';

			$('#shareMode_div').show('fast');
		}
		
		buttonDiv += '<br><br><button type="button" class="btn btn-theme" onclick="editorModify()">MODIFY</button>';
		buttonDiv += '<button type="button" class="btn btn-theme" onclick="registerCancle()">CANCEL</button>';
		
		$("#modify_editorId_div").append(editorIdDiv);
		$("#modify_description_div").append(descriptionDiv);
		$("#modify_startPage_div").append(startPageDiv);
		$("#modify_shareMode_div").append(useRangeDiv);
		$("#modify_setMethod_div").append(setMethodDiv);
		$("#modify_getMethod_div").append(getMethodDiv);
		$("#modify_editorType_div").append(editorTypeDiv);
		$("#modify_editor_button").append(buttonDiv);
	});
};

function editorModify() 
{
	var editorId = $("#editorId").val();
	var description = $("#description").val();
	var startPage = $("#startPage").val();
	var setMethod = $("#setMethod").val();
	var getMethod = $("#getMethod").val();
	var useRange = document.querySelector('input[name="useRange"]:checked').value;
	var editorType = $("#editorType").val();

	$.post("./editorModify",
	{ 
		editorId: editorId,
		description: description,
		startPage : startPage,
		setMethod : setMethod,
		getMethod : getMethod,
		useRange : useRange,
		editorType : editorType
	},

	function(data)
	{
		alert("MODIFY SUCCESS");

		getOwnEditorList();
	});
};

function editorDelete(editorId) 
{
	if (confirm("DO YOU WANT TO DELETE EDITOR?") == true)
	{   
		$.post("./editorDelete",
		{ 
			editorId: editorId
		},

		function(data)
		{
			alert("DELETE SUCCESS");

			getOwnEditorList();
		});
	}

	else
	{   
		return;
	}	
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


/*function getCodeList(editorId)
{
	getContJsCss("edit_code","edit_code");
	
	$.post("./codeList",
	{ 
		editorId : editorId
	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.EditorCodeVOList);
		
		var	editorCode;

		var masterList = "";
		var secondList = "";
		var thirdList = "";

		for(var i = 0 ; i < result.length ; i++)
		{
			editorCode = $.parseJSON(result[i]);

			if(i == 0)
			{
				$("#codeList_title").append('<i class="fa fa-angle-right"></i>' + editorCode['editorId']);
			}
			
			var trashId = editorCode['path'].split("\\");

			for(var j = 1 ; j < trashId.length ; j++)
			{
				if(j == 1)
				{
					masterList += '<li id="' + trashId[1] + i + '"><a href="#"><img src="assets/img/file.png" />' + trashId[1] + '</a></li>';
					
					$("#tree_menu").append(masterList);

					continue;
				}
				
				secondList += '<ul id="' + trashId[j] + j + '"></ul>';
				
				$("#" + trashId[j-1] + i).append(secondList);

				thirdList += '<li><a href="#">' + trashId[j] + '</a></li>';
				
				$("#" + trashId[j] + j).append(thirdList);
			};
		};
	});
};*/



