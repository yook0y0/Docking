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
	var doc = "";
	var memberId = $("#memberId").val();
	var docId = $("#docId").val();
	var body = $("#body").val();
   
   var socket = io.connect("http://localhost:9000");
   console.log('client socket create..');
   socket.emit('room', {room : docId, memberId : memberId});
   
   // receive
   socket.on('roomCreate', function(data) 
   {
      console.log(data);
      
      data_set(data);
   });
   
   socket.on('userList', function(data)
	{
	   var jsonDataList = eval('('+data+')');
	   var setting = "";
	   
	   $('#user_area').html("");
	   
	   for(var i = 0 ; i < jsonDataList.length ; i++)
		{
		   if(jsonDataList[i] != null)
			{
			   setting += "<td><img class='img-responsive' width='32px' height='32px' src='./img/user_img.png' title='" + jsonDataList[i] + "'</img></td>";
			}  
		}
	   
	   $('#user_area').append(setting);
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
         if(doc != data){
         doc = data;
      
         socket.emit('data', {data : data, room : docId, memberId : memberId});
         }
      }, 3000); 
   });
    
/////////////////////////////////////////////////////////////// 채팅 //////////////////////////////////////////////////////////////	   
	socket.on('chat_receive', function(data) 
    {
		 var jsonDataList = eval('('+data+')');
		 
		 var messageType = jsonDataList[0];
		 var messageId = jsonDataList[1];
		 var dat = jsonDataList[2];
		 
		 var message = "";
		 
		 if(messageType == "chat")
		 {
			 if(messageId == memberId)
			 {
				 messageId = "나";
			 }
			 
			 message = messageId + " : " + dat;
		 }
		 
		 else
		 {
			 message = messageId + dat;
		 }
		 
		$("#chat_area").append("<li>" + message + "</li>");
    });
	   
   $("#btn-chat").click(function()
	{
	   var data = $("#btn-input").val();

	   socket.emit('chat_send', {data : data, memberId : memberId});
	   
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
	<input type="hidden" id="memberId" value="${sessionScope.logInMember.id}" />
	<input type="hidden" id="docId" value="${requestScope.docId}" />
	<input type="hidden" id="body" value="${requestScope.body}" />

	
	<c:import url="chat_invite.jsp" />

	<myTag:menubar />
	
	<c:import
		url="http://localhost:8089/Docking/getStartPage?docId=${requestScope.docId}" />
</body>
</html>