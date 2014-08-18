function getContentsList(documentId)
{
	getContJs("list_content","content");

	$.post("./contentsList",
	{ 
		documentId : documentId
	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.contentVOList);
		var content;
		var contentList = "";
		
		var titleDiv = "";
		var btnDiv = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			content = $.parseJSON(result[i]);
			
			if(i == 0)
			{
				titleDiv += '<h5><i class="fa fa-tasks"></i>' + content['title'] + '</h5>';
				titleDiv += '<input type="hidden" id="hidden_documentId" name="hidden_documentId" value ="' + content['documentId'] + '">';
			}
	
			contentList += '<tr>';
			contentList += '<td><a href="./editorExecute?contentId=' + content['contentId'] + '">' + content['editorId'] + '</a></td>';
			contentList += '<td>' + content['body'] + '</td>';
			
			if(content['writer'] == content['logInMember'])
			{
				contentList += '<td>';
				contentList += '<button class="btn btn-primary btn-xs" onclick="contentSearch(\'' + content['contentId'] + '\')">';
				contentList += '<i class="fa fa-pencil"></i></button>';
				contentList += '<button class="btn btn-danger btn-xs" onclick="contentDelete(\'' + content['contentId'] + '\')">';
				contentList += '<i class="fa fa-trash-o "></i></button></td></tr>';
			}

			$("#content_list").append(contentList);
			
			contentList = "";
		}
		
		btnDiv += '<a class="btn btn-success btn-sm pull-left" onclick="contentAddSearch(\'' + documentId + '\')">Add Content</a>';
		
		$("#content_title").append(titleDiv);
		$("#content_add_button").append(btnDiv);
	});
};

function contentAddSearch(documentId)
{
	getContJs("add_content","content");
	
	$.post("./editorSearchAll",
	{ 
		
	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorVO);
		var editor;
		var editorOption = "";
		
		var btnDiv = "";
		
		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorOption += '<option value="' + editor['editorId'] + '">' + editor['editorId'] + '</option>';
			
			if(editor['editorType'] == "0")
			{
				$("#textEditor_c").append(editorOption);
			}
			
			else if(editor['editorType'] == "1")
			{
				$("#mindMap_c").append(editorOption);
			}
			
			else if(editor['editorType'] == "2")
			{
				$("#questionnaire_c").append(editorOption);
			}
			
			else if(editor['editorType'] == "3")
			{
				$("#elseEditor_c").append(editorOption);
			}
			
			editorOption = "";
		}
		
		btnDiv += '<button type="button" class="btn btn-theme" onclick="contentAdd(\'' + documentId + '\')">REGISTER</button>';
		btnDiv += '<button type="button" class="btn btn-theme" onclick="getContentsList(\'' + documentId + '\')">CANCLE</button>';
		
		$("#c_add_btn").append(btnDiv);
	});
};

function contentAdd(documentId)
{
	var body = $("#content_body").val();
	var editorId = $('[name=c_doc_editor]').val();
	
	$.post("./contentAdd", 
	{ 
		documentId: documentId,
		editorId: editorId,
		body: body
	},

	function(data) 
	{   
		getContentsList(documentId);
	});
};

function contentSearch(contentId)
{
	getContJs("modify_content","content");
	
	$.post("./contentSearch", 
	{ 
		contentId: contentId
	},

	function(data) 
	{   
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.contentVO);
		
		var bodyDiv = "";
		var btnDiv = "";
		
		bodyDiv += '<h5>CONTENT BODY</h5>';
		bodyDiv += '<input type="text" class="form-control input-lg" id="m_content_body" name="m_content_body" placeholder="Description" value ="' + result['body'] + '"> <br>';
		bodyDiv += '<input type="hidden" id="m_documentId" name="m_documentId" value ="' + result['documentId'] + '">';
		bodyDiv += '<input type="hidden" id="m_editorId" name="m_editorId" value ="' + result['editorId'] + '">';
		
		btnDiv += '<button type="button" class="btn btn-theme" onclick="contentModify(\'' + result['contentId'] + '\')">MODIFY</button>';
		btnDiv += '<button type="button" class="btn btn-theme" onclick="getContentsList(\'' + result['documentId'] + '\')">CANCLE</button>';
		
		$("#modify_body_div").append(bodyDiv);
		$("#c_modify_btn").append(btnDiv);	
	});
};

function contentModify(contentId)
{
	var body = $("#m_content_body").val();
	var documentId = $("#m_documentId").val();
	var editorId = $("#m_editorId").val();

	$.post("./contentModify", 
	{ 
		contentId: contentId,
		documentId: documentId,
		editorId: editorId,
		body: body
	},

	function(result) 
	{   
		alert("MODIFY SUCCESS");
		
		getContentsList(documentId);
	});
};

function contentDelete(contentId)
{
	var documentId = $("#hidden_documentId").val();
	
	if (confirm("DO YOU WANT TO DELETE CONTENT?") == true)
	{   
		$.post("./contentDelete",
		{ 
			contentId: contentId
		},

		function(data)
		{
			alert("DELETE SUCCESS");

			getContentsList(documentId);
		});
	}

	else
	{   
		return;
	}
};

