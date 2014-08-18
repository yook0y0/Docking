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