$(document).ready(function() {
	$('#upload').click(function() {
		 
		console.log("upload");
        var data = new FormData();
        data.append('editorId',$("#editorId").val());
        data.append('description', $("#description").val());
        data.append('editorZip', editorZip);
        data.append('editorType', 1);
 
        $.ajax({
            url: './editorAdd',
            type: "post",
            dataType: "text",
            data: data,
            // cache: false,
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
            	console.log("success");
                alert(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {}
        });
    });
/*	$('#editorAddForm').ajaxForm("./editorAdd",{
		// 반환할 데이터의 타입. 'json'으로 하면 IE 에서만 제대로 동작하고 크롬, FF에서는 응답을 수신하지
		// 못하는 문제점을 발견하였다. dataType을 정의하지 않을 경우 기본 값은 null 이다.
		dataType : 'text'},
		function(data)
		{
			console.log("@@");
		}
	);*/
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