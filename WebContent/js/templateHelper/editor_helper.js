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
			editorList += '<button class="btn btn-success btn-xs ">';
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
	alert("TEXT EDITOR!");
	$("#editorType").val("0");
};

function selectMindMap()
{
	alert("MIND MAP");
	$("#editorType").val("1");
};

function selectQuestionnaire()
{
	alert("QUESTIONNAIRE!");
	$("#editorType").val("2");
};

function selectElse()
{
	alert("ELSE");
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
		
		for(var i = 0 ; i < result.length-1 ; i++)
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

function getCodeList(editorId)
{
	
	getContJsCss("edit_code","edit_code");
	
	$.post("./codeList",
	{ 
		editorId : editorId
	},

	function(data)
	{
		jData = JSON.parse(data);
		var editorAllCodeDataJsonArray = $.parseJSON(jData.EditorCodeVOList);
		var	editorCode;

		var upperfolder ="";
		var secondfolder ="";
		console.log("start");
		var treeCode="";
		var secondLoop = 0;
		var thirdLoop = 0;
		
		for(var i = 0 ; i < editorAllCodeDataJsonArray.length ; i++)
		{
			editorCode = $.parseJSON(editorAllCodeDataJsonArray[i]);

			var str = editorCode['path'];
			var twiceSlashStr = str.replace(/\\/g,'\\\\');
			var strArray = str.split('\\');
			if(strArray.length == 2){
				treeCode+='<li id=\''+twiceSlashStr+'\'><a onclick="sendPathToOpenDocument(\'' + twiceSlashStr + '\')">'+strArray[1]+'</a><ul></ul></li>';
				continue;
			}
			if(upperfolder != strArray[1]){//1단계가 새로움
				if(secondLoop != 0){
					console.log("1번 하위 폴더 막음");
					treeCode+='</ul></li>';
					secondLoop = 0;
				}
				if((thirdLoop != 0)){
					console.log("2번 하위 폴더 막음");
					treeCode+='</ul></li>';
					thirdLoop = 0;
				}
				upperfolder = strArray[1];
				console.log("ㅡ"+upperfolder);
				treeCode+='<li><a href="#" src="assets/img/file2.gif">'+upperfolder+'</a><ul>';
			}
			else{	//동일한 1단계
				secondLoop++;		
			}
			if(secondfolder != strArray[2]){//새로운 2단계 + 그냥 씀
				
				if(thirdLoop != 0)
				{
					console.log("2번 하위 폴더 막음");
					treeCode += '</ul></li>';
					thirdLoop = 0;
				}
				
				secondfolder = strArray[2];
				
				
				startInt = editorCode['editorId'].length + 2 + upperfolder.length+secondfolder.length;
				
				if(str.length == startInt){//2단계가 마지막일 경우 끝냄
					console.log("		ㄴ하나뿐인 2단계"+secondfolder);
					treeCode+='<li id=\''+twiceSlashStr+'\'><a onclick="sendPathToOpenDocument(\'' + twiceSlashStr + '\')">'+secondfolder+'</a></li>';
					secondLoop++;
					continue;
				}else{//3단계가 있음
					treeCode+='<li><a href="#")>'+secondfolder+'</a><ul>';
					console.log("		ㄴ새로운 2단계"+secondfolder);
					startInt = editorCode['editorId'].length + 3 + upperfolder.length+secondfolder.length;
					console.log("				ㄴ3단계"+ str.substring(startInt) );
					treeCode += '<li id=\''+twiceSlashStr+'\'><a onclick="sendPathToOpenDocument(\'' + twiceSlashStr + '\')">'+str.substring(startInt)+'</a></li>';//3단계 이상되는 파일 경로 그냥 씀
					secondLoop++;
					thirdLoop++;
				}
			}
			else{//동일한 2단계
				startInt = editorCode['editorId'].length + 3 + upperfolder.length+secondfolder.length;
				console.log("				ㄴ3단계"+ str.substring(startInt) );
				treeCode += '<li id=\''+twiceSlashStr+'\'><a onclick="sendPathToOpenDocument(\'' + twiceSlashStr + '\')">'+str.substring(startInt)+'</a></li>';//3단계 이상되는 파일 경로 그냥 씀
				thirdLoop++;
				secondLoop++;
			}

		}
		
		if(thirdLoop != 0){
			treeCode+='</ul></li>';
		}
		if(secondLoop != 0){
			treeCode+='</ul></li>';
		}
		treeCode+='</ul></li>';
		
		$('#tree_menu').append(treeCode);
		load_tree(editorId);
		
	});
};



