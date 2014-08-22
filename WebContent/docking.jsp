<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">
<head>
<style>
	@import url(http://weloveiconfonts.com/api/?family=typicons);
	
	[class*="typicons-"]:before {
		font-family: 'Typicons', sans-serif;
	}
	
	.module {
		width: 300px;
		margin: 20px auto;
	}
	
	.top-bar {
		background: #666;
		color: white;
		padding: 0.5rem;
		position: relative;
		overflow: hidden; h1 { display : inline;
		font-size: 1.1rem;
	}
	
	.typicons-message {
		display: inline-block;
		padding: 4px 5px 2px 5px;
	}
	
	.typicons-minus {
		position: relative;
		top: 3px;
	}
	
	.left {
		float: left;
	}
	
	.right {
		float: right;
		padding-top: 5px;
	}
	
	>
	* {
		position: relative;
	}
	
	&
	::before {
		content: "";
		position: absolute;
		top: -100%;
		left: 0;
		right: 0;
		bottom: -100%;
		opacity: 0.25;
		background: radial-gradient(white, black);
		animation: pulse 1s ease alternate infinite;
	}
	
	}
	.discussion {
		list-style: none;
		background: #e5e5e5;
		margin: 0;
		padding: 0 0 50px 0; // finality li { padding : 0.5rem;
		overflow: hidden;
		display: flex;
	}
	
	.avatar {
		width: 40px;
		//
		stronger
		than
		%
		//
		could
		set
		height,
		but
		gonna
		bottom-align
		instead
		position
		:
		relative;
		//
		for
		triangle
		img
		{
		display
		:
		block;
		//
		triangle
		position
		width
		:
		100%;
	}
	
	}
	}
	.other { .avatar { &:after {
						      content : "";
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border: 5px solid white;
		border-left-color: transparent;
		border-bottom-color: transparent;
	}
	
	}
	}
	.self {
		justify-content: flex-end;
		align-items: flex-end; . messages { order : 1;
		border-bottom-right-radius: 0;
		//
		weird
		shadow
		fix
	}
	
	.avatar {
		order: 2; &: after { content : "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 0;
		border: 5px solid white;
		border-right-color: transparent;
		border-top-color: transparent;
		box-shadow: 1px 1px 2px rgba(black, 0.2);
		//
		not
		quite
		perfect
		but
		close
	}
	
	}
	}
	.messages {
		background: white;
		padding: 10px;
		border-radius: 2px;
		box-shadow: 0 1px 2px rgba(black, 0.2); p { font-size : 0.8rem;
		margin: 0 0 0.2rem 0;
	}
	
	time {
		font-size: 0.7rem;
		color: #ccc;
	}
	
	}
	@
	keyframes pulse {from { opacity:0;
		
	}
	
	to {
		opacity: 0.5;
	}
	
	}
	#chat_main {
		position: absolute;
		top: 20px;
		right: 5px;
	}
</style>

<!-- <style>
	html, body
	{
		width: 100%;
		height: 100%; 
		overflow:hidden;
	}
</style> -->
<%@ include file="import.html"%>

<script src="socket.io.js"></script>
<title>DOCKING - Real-time working environment</title>


</head>
<body>
	<input type="hidden" id="h_documentId" value="${requestScope.documentId}" />
	<input type="hidden" id="h_memberId" value="${requestScope.memberId}" />
	<input type="hidden" id="h_contentId" value="${requestScope.contentId}" />
	<input type="hidden" id="h_masterId" value="${requestScope.masterId}" />

	<section id="container"> <header class="header black-bg">
	<div class="sidebar-toggle-box">
		<div class="fa fa-bars tooltips" data-placement="right"
			data-original-title="Toggle Navigation"></div>
	</div>
	<a href="./main.jsp" class="logo"><b>DOCKING</b></a> <!--  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////   -->

	<!--logo end-->
	<div class="nav notify-row" id="top_menu">
		<!--  notification start -->
		<ul class="nav top-menu">
			<!-- settings start -->

			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////초대 -->
			<li class="dropdown"><a data-toggle="dropdown"
				class="dropdown-toggle" onclick="inviteMember()"> <i
					class="fa fa-tasks"></i> <span class="badge bg-theme"></span>
			</a></li>

			<!-- settings end -->
			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////초대 -->

			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////채팅 -->
			<li id="header_inbox_bar" class="dropdown"><a
				data-toggle="dropdown" class="dropdown-toggle"
				onclick="chatToggle()"> <i class="fa fa-envelope-o"></i> <span
					class="badge bg-theme" id="chat_count"> </span>
			</a></li>
			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////채팅 -->

			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////조인멤버 -->
			<li class="dropdown"><a data-toggle="dropdown"
				class="dropdown-toggle" href="index.html#"> <i
					class="fa fa-tasks"></i> <span class="badge bg-theme"
					id="user_count_area"> </span></a>
				<ul class="dropdown-menu extended tasks-bar" id="user_area">

				</ul></li>
			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////조인멤버 -->

			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////컨텐츠 -->
			<li class="dropdown"><a data-toggle="dropdown"
				class="dropdown-toggle" href="index.html#"> <i
					class="fa fa-tasks"></i> <span class="badge bg-theme">${contentCount }</span></a>
				<ul class="dropdown-menu extended tasks-bar">
					<div class="notify-arrow notify-arrow-green"></div>
					<li><p class="green">CONTENTS LIST!</p></li>
					<c:forEach var="item" items="${contentsViewList}">
						<li><a onclick="changeFrame('${item.contentId}','${item.editorId}','${item.startPage}')">
								<div class="task-info">
									<div class="desc">${item.editorId}</div>
								</div>
						</a></li>
					</c:forEach>
				</ul></li>
			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////컨텐츠 -->

			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////백업 -->
			<li class="dropdown"><a data-toggle="dropdown"
				class="dropdown-toggle" href="index.html#"> <i
					class="fa fa-tasks"></i> <span class="badge bg-theme"></span>
			</a>
				<ul class="dropdown-menu extended tasks-bar" id="backUp_area">
					<div class="notify-arrow notify-arrow-green"></div>
					<li>
						<p class="green">BACK UP LIST</p>
					</li>
				</ul></li>
			<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////백업 -->

		</ul>
	</div>



	<!--  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////   -->
	<div class="top-menu">
		<ul class="nav pull-right top-menu" id="login_ul">
			 <li style="margin:10px">
				<div class="btn-group">
					<button type="button" class="btn btn-theme dropdown-toggle"
						id="backUp_btn">BACKUP</button> 
				</div>
			</li>
			
			<li style="margin:10px">
				<div class="btn-group">
					<button type="button" class="btn btn-theme dropdown-toggle"
						onclick='window.location = "main.jsp";'>EXIT</button>
				</div>
			</li>
		</ul>
	</div>

	</header> <!--header end--> <!-- **********************************************************************************************************************************************************
	      MAIN SIDEBAR MENU
	      *********************************************************************************************************************************************************** -->
	<!--sidebar start--> <aside> <%-- <div id="sidebar" class="nav-collapse " style="display:none">
			<!-- sidebar menu start-->
			<ul class="sidebar-menu" id="nav-accordion">
				<li class="sub-menu"><a onclick="getCont('main');"> <i
						class="fa fa-home"></i> <span>HOME</span>
				</a> <li class="sub-menu"><a onclick='getJoinedDocumentList()'> <i
						class="fa fa-book"></i> <span>DOCUMENT</span>
				</a>
				
				<li class="sub-menu"><a onclick='getReviewList()'> <i
						class="fa fa-th"></i> <span>REVIEW</span>
				</a> <c:if test="${sessionScope.logInMember.type == 1 }">
						<li class="sub-menu"><a onclick='getOwnEditorList()'> <i
								class="fa fa-desktop"></i> <span>FOR DEVELOPER</span>
						</a>
					
					</c:if>
			
			</ul>
			<!-- sidebar menu end-->
		</div>
		</aside> <!--main content end-->  --%></section>

	<!-- js placed at the end of the document so the pages load faster -->
	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/jquery-1.8.3.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<script class="include" type="text/javascript"
		src="assets/js/jquery.dcjqaccordion.2.7.js"></script>
	<script src="assets/js/jquery.scrollTo.min.js"></script>
	<script src="assets/js/jquery.nicescroll.js" type="text/javascript"></script>
	<script src="assets/js/jquery.sparkline.js"></script>


	<!--common script for all pages-->
	<script src="assets/js/common-scripts.js"></script>
	<script type="text/javascript"
		src="assets/js/gritter/js/jquery.gritter.js"></script>
	<script type="text/javascript" src="assets/js/gritter-conf.js"></script>
	<!--script for this page-->
	<script src="assets/js/sparkline-chart.js"></script>
	<script src="assets/js/zabuto_calendar.js"></script>
	<script type="application/javascript">
		
	var socket;
	var contentId;
	var memberId;
	var docId;
	var masterId;
	
	        $(document).ready(function () 
	       	{        		   	
	        	memberId = $("#h_memberId").val();
	        	docId = $("#h_documentId").val();
	        	contentId = $("#h_contentId").val();
	        	masterId = $("#h_masterId").val();
	        	
	          	socket = io.connect("http://localhost:9000");
	          	
	           console.log('client socket create..');
	           
	           socket.emit('room', {room : docId, memberId : memberId});
	   		
	           socket.on('userList', function(data)
	        	{
	        	   var jsonDataList = eval('('+data+')');
	        	   var setting = "";
	        	   
	        	   var user_count_area = 0;
	        	   
	        	   $('#user_area').html("");
	        	   
	        	   $('#user_area').append('<div class="notify-arrow notify-arrow-green"></div>');
	        	   $('#user_area').append('<li><p class="green">JOINED MEMBER LIST!</p></li>');
	        	   
	        	   $('#user_count_area').html("");
	        	   
	        	   for(var i = 0 ; i < jsonDataList.length ; i++)
	        		{
	        		   if(jsonDataList[i] != null)
	        			{
	                   		setting += '<li>';
	                   		setting += '<a href="index.html#">';
	                   		setting += '<div class="task-info">';
	                   		setting += '<div class="desc">' + jsonDataList[i] + '</div>';
	                   		setting += '</div></a></li>';
	                   		
	                   		user_count_area++;
	        			}  
	        		}
	        	   
	        	   $('#user_count_area').append(user_count_area);
	        	   $('#user_area').append(setting);
	        	});
	           
	           socket.on('map', function(data) 
       		   {
       			   var jsonDataList = eval('('+data+')');
       			   
       				console.log('data receive..');
       			
       			   if(jsonDataList.contentId == contentId)
       			   {
       					$('#editor_frame')[0].contentWindow.data_set(jsonDataList.data);
       			   }  
       		   });
	           
	           $('#editor_frame').on("load" , function()
	        	{
	        	   $(document.getElementById('editor_frame').contentWindow.document).keydown(function()
	       	        { 
	        		   setTimeout(function()
    	  	  		      {
    	  	  		         console.log('data send..');
    	
    	  	  		         var data = $('#editor_frame')[0].contentWindow.data_get();
    	  	  		         
    	  	  		      	socket.emit('data', {data : data, room : docId, memberId : memberId, contentId : contentId});
    	  	  		         
    	  	  		      }, 100); 
	       	        });	
	        	   
	        	   $(document.getElementById('editor_frame').contentWindow.document).mouseup(function()
   	       	        { 
   	        		    setTimeout(function()
       	  	  		      {
       	  	  		         console.log('data send..');
       	
       	  	  		         var data = $('#editor_frame')[0].contentWindow.data_get();
       	  	  		         
       	  	  		      	socket.emit('data', {data : data, room : docId, memberId : memberId, contentId : contentId});
       	  	  		         
       	  	  		      }, 100);  
   	       	        });
	       		});
	           
	           
	           
	           /* $('#editor_frame').contents().find('body').keydown(function() 
       		    {
	        	   alert("keyUp");
	        	   
	        	   setTimeout(function()
	  	  		      {
	  	  		         console.log('data send..');
	
	  	  		         var data = $('#editor_frame')[0].contentWindow.data_get();
	  	  		         
	  	  		      	socket.emit('data', {data : data, room : docId, memberId : memberId, contentId : contentId});
	  	  		         
	  	  		      }, 3000); 
       		   }); */
	            
  		      
  		      
  		      
  		      
	           
	           var chat_count = 0;
	           
	           socket.on('chat_receive', function(data) 
			    {
					 var jsonDataList = eval('('+data+')');
					 
					 var messageType = jsonDataList[0];
					 var messageId = jsonDataList[1];
					 var dat = jsonDataList[2];
					 
					 var message = "";
					 var messageList = "";
					 
					 if(messageType == "chat")
					 {
						 if(messageId == memberId)
						 {
							 messageId = "나";
							 
							 message = messageId + " : " + dat;
							 
							 messageList += '<li class="self">';
							 messageList += '<div class="avatar">';
							 messageList += '----------------------------------------------------------------------';
							 messageList += '</div>';
							 messageList += '<div class="messages"><p>' + message + '</p></div></li>';
						 }
						 
						 else
						 {
							 message = messageId + dat;
							 
							 messageList += '<li class="other">';
							 messageList += '<div class="avatar">';
							 messageList += '----------------------------------------------------------------------';
							 messageList += '</div>';
							 messageList += '<div class="messages"><p>' + message + '</p></div></li>';
						 }
					 }
					 
					 else
					 {
						 message = messageId + dat;
						 
						 messageList += '<li class="other">';
						 messageList += '<div class="avatar">';
						 messageList += '----------------------------------------------------------------------';
						 messageList += '</div>';
						 messageList += '<div class="messages"><p>' + message + '</p></div></li>';
					 }
					 
					$("#chat_area").append(messageList);
					
					$("#chat_count").html("");
					
					chat_count++;
					
					if(isShow == 1)
					{
						chat_count = 0;
					}
					
					$("#chat_count").append(chat_count);
			    });
				   
			   $("#btn-chat").click(function()
				{
				   var data = $("#btn-input").val();
			
				   socket.emit('chat_send', {room : docId, data : data, memberId : memberId});
				   
				   $("#btn-input").val("");
				});
			   
			   $("#backUp_btn").click(function()
				{
				   var data = $('#editor_frame')[0].contentWindow.data_get();
			
				   socket.emit('backUp_send', {room : docId, data : data, memberId : memberId, contentId : contentId});
				});
			   
			   var backUp_count = 0;
			   
			   socket.on('backUp_receive', function(data) 
			    {
				   var jsonDataList = eval('('+data+')');
				   
				   if(jsonDataList[1] == contentId)
					{
					   jData = JSON.parse(jsonDataList[0]);
					   
						var result = $.parseJSON(jData.tempVO);
						
						var tempDiv = "";
						
						if(backUp_count == 8)
						{
							tempDiv +='<li><p class="green">BACK UP LIST</p></li>';
							backUp_count = 0;
							$("#backUp_area").html("");
						}
	
						tempDiv += '<li>';
						tempDiv += '<button style="width:100%" onclick="setBackUpData(\'' + result['tempId'] + '\')">';
						tempDiv += '<div class="task-info">';
						tempDiv += '<div class="desc">' + result['date'] + '</div>';
						tempDiv += '<div class="percent">' + result['memberId'] + '</div>';
						tempDiv += '</div>';
						tempDiv += '<div class="progress progress-striped">';
						tempDiv += '</div></button></li>';
						
						backUp_count++;
						
						$("#backUp_area").append(tempDiv);
					}
			    });
			   
			   socket.on('get_backUpData', function(data) 
	   		   {
	   			   var jsonDataList = eval('('+data+')');
	   			   
	   			   if(jsonDataList[1] == contentId)
   				 	{
	   					$('#editor_frame')[0].contentWindow.data_set(jsonDataList[0]);
   				  	}  
	   		   });
			  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  			$('select.styled').customSelect();
	            $("#date-popover").popover({html: true, trigger: "manual"});
	            $("#date-popover").hide();
	            $("#date-popover").click(function (e) {
	                $(this).hide();
	            });
	        });
	        
			function setInitData()
			{
   	        	socket.emit('set_initData', {room : docId , contentId : contentId});
			};

	        function setBackUpData(tempId)
	        {
	        	 var data = tempId;
	 			
				 socket.emit('set_backUpData', {room : docId, data : data, contentId : contentId});
	        };
	        
	        function changeFrame(conId, editorId, startPage)
	        {
	        	$('#editor_frame').attr('src', "http://localhost:8089/Docking/getEditorCode?path=" + startPage + "&editorId=" + editorId);

	        	contentId = conId;
	        }
		</script>



	<section class="module" id="chat_main" style="display:none">
	<header class="top-bar">
	<div class="left">
		<span class="icon typicons-message"></span>
		<h1>DOCKING CHAT</h1>
	</div>
	</header>

	<div style="overflow: scroll; width: 300px; height: 450px;">
		<ol class="discussion" id="chat_area">

		</ol>
	</div>

	<div class="panel-footer">
		<div class="input-group">
			<input id="btn-input" type="text" class="form-control input-sm"
				placeholder="Type your message here..." /> <span
				class="input-group-btn">
				<button class="btn btn-warning btn-sm" id="btn-chat">Send</button>
			</span>
		</div>
	</div>
	</section>
	
	<div style="width:100%; height:100%; padding:55px 0 0 0;">
 		<iframe style="height:100%; width:100%" src="http://localhost:8089/Docking/getEditorCode?path=${requestScope.startPage}&editorId=${requestScope.editorId}" id="editor_frame" onLoad="setInitData()"></iframe>
 	</div> 
</body>
</html>
