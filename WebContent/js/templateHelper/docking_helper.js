function inviteMember()
{
	$.gritter.add
	({
        title: 'INVITE MEMBER!',
        text: '<font color="black"><input type="text" style="font-color:black" id="invite_member" placeholder="Email" /></font>&nbsp;&nbsp;&nbsp<a onclick="inviteAction()" target="_blank" style="color:#ffd777">Invite</a>',
        image: 'assets/img/ui-sam.jpg',
        sticky: true,
        time: '',
        class_name: 'my-sticky-class'
    });

    return false;
};

function inviteAction()
{
	var memberId = $("#invite_member").val();
	var documentId = $("#h_documentId").val();
	
	$.post("./memberInvite",
	{ 
		documentId : documentId,
		memberId : memberId
	},
	
	function(data)
	{
		alert(data);
	});
};

var isShow = 0;

function chatToggle()
{
	$('#chat_main').toggle();
	
	if(isShow == 0)
	{
		isShow = 1;
	}
	
	else
	{
		isShow = 0;
	}
};

function backUpAdd()
{
	var memberId = $("#h_memberId").val();
	var contentsBody = "";
	var contentId = $("#h_contentId").val();;
	
	$.post("./tempAdd",
	{ 
		memberId : memberId,
		contentsBody : contentsBody,
		contentId : contentId
	},
	
	function(data)
	{
		jData = JSON.parse(data);
		var result = $.parseJSON(jData.tempVO);
		
		var tempDiv = "";
		
		tempDiv += '<li>';
		tempDiv += '<a onclick="tempSearch(\'' + review['tempId'] + '\')">';
		tempDiv += '<div class="task-info">';
		tempDiv += '<div class="desc">' + result['date'] + '</div>';
		tempDiv += '<div class="percent">' + result['memberId'] + '</div>';
		tempDiv += '</div>';
		tempDiv += '<div class="progress progress-striped">';
		tempDiv += '</div></a></li>';

		$("#backUp_area").append(tempDiv);
	});
};

function tempSearch(tempId)
{
	$.post("./tempSearch",
	{ 
		tempId : tempId
	},
	
	function(data)
	{
		// 소켓으로 데이터 쏴주는거
	});
}