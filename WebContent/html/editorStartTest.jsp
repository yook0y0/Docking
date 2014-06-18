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
<script src="../assets/js/socket.io.js"></script>

<script>
	$(document).ready(function() {

		var socket = io.connect("http://localhost:11111");
		console.log('client socket create..');
		
		// receive
		socket.on('response', function(data) {
			console.log('data receive..');
			
			/* 서버로부터 실시간 데이터 수신하여 화면에 데이터 뿌려줄 메소드 호출 */
			jMap.controller.customLoadMap(data);
		});

		// send
 		$("body").keydown(function() 
 		{
			setTimeout(function() 
			{ 
				console.log('data send..');
			
				var data = jMap.toXML();
			
				socket.emit('data', {data : data});
			}, 3000); 

		});
	});
</script>

</head>
<body>
	<myTag:menubar />
	<%-- <c:import url="http://localhost:8089/Docking/getStartPage?name=testName&editorName=hfhfhf&pName=start.html" /> --%>
	<c:import url="{startPage}" />
	<myTag:copyright />
</body>
</html>