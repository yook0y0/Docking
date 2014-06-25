<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<link rel='stylesheet' type='text/css' href='css/bootstrap.css' />
<link rel='stylesheet' type='text/css' href='css/main.css' />

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<script src="./js/socket.io.js"></script>

<script>
$(document).ready(function() 
{
	var memberId = $("#memberId").val();
	var docId = $("#docId").val();
	var body = $("#body").val();
   
   var socket = io.connect("http://localhost:9000");
   console.log('client socket create..');
   socket.emit('room', {room : docId});
   
   // receive
   socket.on('roomCreate', function(data) 
   {
      console.log(data);
      
      data_set(data);
   });
   
   socket.on('map', function(data) 
   {
	   var jsonDataList = eval('('+data+')');
	      
	   data_set(jsonDataList.data);  
   });
    
    $("body").keydown(function() 
    {
      setTimeout(function()
      {
         console.log('data send..');
      
         var data = data_get();
      
         socket.emit('data', {data : data, room : docId, memberId : memberId});
      }, 3000); 
   });
    
/////////////////////////////////////////////////////////////// 채팅 //////////////////////////////////////////////////////////////	   
	socket.on('chat_receive', function(data) 
    {
		$("#chat_area").append("<li>" + data + "</li>");
    });
	   
   $("#btn-chat").click(function()
	{
	   var data = memberId + "의 메시지 : ";
	   data += $("#btn-input").val();
	   
	   socket.emit('chat_send', {data : data});
	   
	   $("#btn-input").val("");
	});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////// 백업 //////////////////////////////////////////////////////////////
		
	setInterval(function()
	{
	   var docId = $("#docId").val();
	   var data = data_get();
	
	   $.post("./temp_add", 
		{ 
   			docId : docId,
			data : data
		},
		
		function(result) 
		{	
			var	data = result.split("|");
			
			var docId = data[0];
			var lastDate = data[1];
			var date = data[2];
			
			 $("#backUp_area").append("<li><a href='./temp_searchAll?docId=" + docId + "&lastDate=" + lastDate + "'>" + date + "</a></li>");
		});
	}, 10000);   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   });
</script>

</head>

<body>
	<input type="hidden" id="memberId" value="${requestScope.memberId}" />
	<input type="hidden" id="docId" value="${requestScope.docId}" />
	<input type="hidden" id="body" value="${requestScope.body}" />

	
	<c:import url="chat_invite.jsp" />

	<myTag:menubar />
	
	<c:import
		url="http://localhost:8089/Docking/getStartPage?docId=${requestScope.docId}" />
</body>
</html>