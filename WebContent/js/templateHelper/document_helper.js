function getJoinedDocumentList()
{
	getContJs("list_document","document");
	
	$.post("./joinDocumentList",
	{ 

	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.documentVOList);
		var document;
		var documentList = "";

		for(var i = 0 ; i < result.length ; i++)
		{
			document = $.parseJSON(result[i]);
			
			documentList += '<tr>';
			documentList += '<td>' + document['creationDate'] + '</td>';
			documentList += '<td><a onclick="getContentsList(\'' + document['documentId'] + '\')">' + document['title'] + '</a></td>';
			documentList += '<td>' + document['writer'] + '</td>';
			
			if(document['writer'] == document['logInMember'])
			{
				documentList += '<td>';
				documentList += '<button class="btn btn-success btn-xs" onclick="documentInfo(\'' + document['documentId'] + '\')">';
				documentList += '<i class="fa fa-check"></i></button>';
				documentList += '<button class="btn btn-primary btn-xs" onclick="documentSearch(\'' + document['documentId'] + '\')">';
				documentList += '<i class="fa fa-pencil"></i></button>';
				documentList += '<button class="btn btn-danger btn-xs" onclick="documentDelete(\'' + document['documentId'] + '\')">';
				documentList += '<i class="fa fa-trash-o "></i></button></td></tr>';
			}

			$("#joinDocumentList").append(documentList);
			
			documentList = "";
		}
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
function documentAdd() 
{
	var title = $("#title").val();

	$.post("./documentAdd", 
	{ 
		title: title
	},

	function(data) 
	{   
		getJoinedDocumentList();
	});
};

function documentSearch(documentId)
{
	getContJs("modify_document","document");
	
	$.post("./documentSearch", 
	{ 
		documentId: documentId
	},

	function(data) 
	{   
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.modifyDocumentVO);
		
		var titleDiv = "";
		var buttonDiv = "";
		
		titleDiv += '<h5>DOCUMENT TITLE</h5>';
		titleDiv += '<input type="text" class="form-control input-lg" id="modify_title_text" name="modify_title" placeholder="TITLE" value ="' + result['title'] + '"> <br>';
		
		buttonDiv += '<br><br><button type="button" class="btn btn-theme" onclick="documentModify(\'' + result['documentId'] + '\')">MODIFY</button>';
		buttonDiv += '<button type="button" class="btn btn-theme" onclick="getJoinedDocumentList()">CANCEL</button>';
		
		$("#modify_title").append(titleDiv);
		$("#btn_div").append(buttonDiv);	
	});
};

function documentModify(documentId)
{
	var title = $("#modify_title_text").val();

	$.post("./documentModify", 
	{ 
		documentId: documentId,
		title: title
	},

	function(result) 
	{   
		alert("MODIFY SUCCESS");
		
		getJoinedDocumentList();
	});
};

function documentDelete(documentId)
{
	if (confirm("DO YOU WANT TO DELETE DOCUMENT?") == true)
	{   
		$.post("./documentDelete",
		{ 
			documentId: documentId
		},

		function(data)
		{
			alert("DELETE SUCCESS");

			getJoinedDocumentList();
		});
	}

	else
	{   
		return;
	}
};

function documentInfo(documentId)
{
	getContJs("document_info","document");
	
	$.post("./ownDocumentList",
	{ 
		documentId: documentId
	},

	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.editorInfo);
		var result2 = $.parseJSON(jData.memberInfo);
		
		var editor;
		var editorList = "";
		
		var member;
		var memberList = "";

		for(var i = 0 ; i < result.length ; i++)
		{
			editor = $.parseJSON(result[i]);
			
			editorList += '<tr>';
			editorList += '<td><span class="check"></span> ';
			editorList += '<a href="#">' + editor['editorId'] + '</a></span>';
			editorList += '<button class="close" aria-hidden="true" data-dismiss="alert" type="button"></button></td></tr>';
			
			$("#editor_info").append(editorList);
			
			editorList = "";
		}
		
		for(var i = 0 ; i < result2.length ; i++)
		{
			member = $.parseJSON(result2[i]);
			
			memberList += '<li>';
			memberList += '<div class="task-checkbox"></div>';
			memberList += '<div class="task-title">';
			memberList += '<span class="task-title-sp">' + member['memberId'] + '</span> &nbsp;&nbsp;&nbsp;&nbsp;';
			
			if(member['memberPosition'] == '0')
			{
				memberList += '<span class="badge bg-info">READ ONLY</span>';
			}
			
			else if(member['memberPosition'] == '1')
			{
				memberList += '<span class="badge bg-warning">WRITER</span>';
			}
			
			else
			{
				memberList += '<span class="badge bg-important">MASTER</span>';
			}
			
			memberList += '<span class="badge bg-theme"></span><div class="pull-right hidden-phone"></div></div></li>';
			
			$("#member_info").append(memberList);
			
			memberList = "";
		}
	});
};