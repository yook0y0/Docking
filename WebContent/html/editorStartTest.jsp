<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<script src="assets/js/socket.io.js"></script>

<script>
$(document).ready(function() 
{
	var docId = $("#docId").val();
	var port = $("#port").val();
	var body = $("#body").val();
	
	console.log("docId : " + docId);
	console.log("body : " + body);
	console.log("port : " + port);
	
	var socket = io.connect("http://localhost:" + port);
	console.log('client socket create..');
	socket.emit('room', {room : docId});
	
	// receive
	socket.on('room create', function(data) 
	{
		console.log(data);
		
		/* jMap.controller.customLoadMap(data);
		 */
		//_load_(data);
	});
	
	socket.on('map', function(data) 
			{
				console.log(data);
				
				jMap.controller.customLoadMap(data);
				 
				//_load_(data);
			});
	
	 //send
	 
	 $("body").keydown(function() {
 			
 			// '\' �ㅼ뼱�ㅻ㈃ �꾩넚
 				console.log('data send..');
 				
 				/* 蹂대궡�� �ㅼ떆媛� �꾩넚�� �곗씠�곕� data�� �ｌ뼱�쇳븿 */
				var data = jMap.toXML();
			
				socket.emit('data', {data : data, room : docId});
 
		});

	/* setTimeout(function() {
			alert("data send");

			console.log('data send..');

			var data = jMap.toXML();

			//var data = _load_data_();

			socket.emit('data', {
				data : data
			});
		}, 3000); */

		/* $('#memberSearch_button').click(function(event)
		{
			var memberId = $("#invite_member").val();
			
			$.post("member_search", 
					{ 
						memberId: memberId,
					},
					
					function(result) 
					{	
						$("#search_result").val(result);
					}
			);
		});	
		
		$('#inviteMember_button').click(function(event)
		{
			var memberId = $("#search_result").val();
			var docId = $("#docId").val();
			var portNum = $("#portNum").val();
			
			alert(memberId);
			alert(docId);
			alert(portNum);
			
			$.post("joinedmember_add", 
					{ 
						memberId: memberId,
						docId : docId,
						portNum : portNum
					},
					
					function(result) 
					{	
						alert(result);
					
						//location.reload();
					}
			);
		});  */
	});
</script>

</head>

<body>
	<input type="hidden" id="docId" value="${requestScope.docId}" />
	<input type="hidden" id="body" value="${requestScope.body}" />
	<input type="hidden" id="port" value="${requestScope.port }" />

	<button id="invite_button" type="button">Invite!</button>

	<div id="member_search_div">
		<input type="text" id="invite_member" placeholder="Email" />
		<button id="memberSearch_button">Search</button>
	</div>

	<div id="member_searchResult_div">
		<input type="text" id="search_result" readonly />
		<button id="inviteMember_button">Invite!</button>
	</div>


	<myTag:menubar />
	<c:import
		url="http://localhost:8089/Docking/getStartPage?docId=${requestScope.docId}" />
	<myTag:copyright />
</body>
</html>