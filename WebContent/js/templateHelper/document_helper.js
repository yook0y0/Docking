function documentAdd() 
{
	var title = $("title").val();

	$.post("./documentAdd", 
			{ 
		title: title,
			},

			function(result) 
			{   
				window.location = "start.jsp";
			});
};

function documentWrite(url){
	getCont(url);
	$.post("./joinDocumentList", 
			{ },

			function(data) 
			{   
				jData = JSON.parse(data);
				var result = $.parseJSON(jData.documentVOList);
				var str='';

				$.each(result, function(i, v){
					str += '<tr>';
					str += '<td>'+v.writer+'</td>';
					str += '<td><a onclick="getCont("content_list");">'+v.title+'/'+v.type+'</a></td>';
					str += '<td>'+v.creationDate+'</td>';
					str += '</tr>';
				});

				/*
         var   documentId = "";
         var writer = "";
         var title = "";
         var creationDate = "";
         documentId += result['documentId'];
         writer += result['writer'];
         creationDate += result['creationDate'];
         title += result['title'];*/

				$("#documentListTbody").append(str);
			});
};

function documentManage(){

	getCont(url);
	$.post("./ownDocumentList", 
			{ },

			function(data) 
			{   
				jData = JSON.parse(data);
				var result = $.parseJSON(jData.documentVOList);
				var str='';
				str += '<tr>';
				$.each(result, function(i, v){

					str += '<td>'+v.type+'</td>';
					str += '<td>'+v.title'</td>';
					str += '<td>'+v.creationDate+'</td>';
					str += '<td><a>Modify</a>/ <a>Delete</a></td>';

				});
				str += '</tr>';
				/*
            var   documentId = "";
            var writer = "";
            var title = "";
            var creationDate = "";
            documentId += result['documentId'];
            writer += result['writer'];
            creationDate += result['creationDate'];
            title += result['title'];*/

				$("#documentListTbody").append(str);
			});
};