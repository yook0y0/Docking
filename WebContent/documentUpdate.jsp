<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
 function modify(){
		
			var id = $("#id").val();
			var writer = $("#writer").val();
			var title = $("#title").val();
			var content = $("#content").val();
			var type = $("#type").val();
			var creationDate = $("#creationDate").val();
			
			$.post("./document_modify", 
					{ 
						id: id,
						writer: writer,
						title: title,
						content: content,
						type: type,
						creationDate: creationDate
					},
					
					function(result) 
					{	
						console.log(result);
					}
			);
		};

		/* $('#delete_button').click(function(event)
		{
			var memberId = $("#modify_memberId").val();
			var con = confirm("Do you really want to quit docking?");
		 	
			if(con == true)
			{
				$.post("../member_delete", 
						{ 
							memberId: memberId,
						},
						
						function(result) 
						{	
							alert(result);	
							
							window.location = "start.jsp";	
						}
				);
		 	}
			
			else{}
		}); */
</script>
</head>
<body>
	<myTag:menubar />
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<!-- +++++ Modify Section +++++ -->
	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>Modify Docking!</h3>
				<hr>
				<p>Modify Your Information</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-8 col-lg-offset-2">
				<form role="form">

					<div class="form-group">
						document id : <input type="text" class="form-control" id="id"
							name="id" value="${requestScope.dvo.id}" readonly>
						<br>
					</div>

					<div class="form-group">
						writer : <input type="text" class="form-control" id="writer"
							name="writer" value="${requestScope.dvo.writer}" readonly>
						<br>
					</div>
					
					<div class="form-group">
						title : <input type="text" class="form-control" id="title"
							name="title" value="${requestScope.dvo.title}">
						<br>
					</div>
					
					<div class="form-group">
						content : <input type="text" class="form-control" id="content"
							name="content" value="${requestScope.dvo.content}" readonly>
						<br>
					</div>

					<div class="form-group">
						type : <input type="text" class="form-control" id="type"
							name="type" value="${requestScope.dvo.type}" readonly>
						<br>
					</div>
					
					<div class="form-group">
						creationDate : <input type="text" class="form-control" id="creationDate"
							name="creationDate" value="${requestScope.dvo.creationDate}" readonly>
						<br>
					</div>

					<br>

					<button type="button" class="btn btn-success" id="modify_button" onclick="modify()">Modify</button>
					<button type="button" class="btn btn-success" id="cancel_button">cancel</button>
				</form>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>