<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
function documentRegister() 
{
	var docTitle = $("#doc_title").val();
	var docEditor = $("#doc_editor").val();

	console.log(docTitle);
	console.log(docEditor);
	$.post("./document_add", 
			{ 
				docTitle: docTitle,
				docEditor: docEditor,
			},
			
			function(result) 
			{	
				alert(result);	
				
				window.location = "start.jsp";
	});
};
</script>
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Register Section +++++ -->
	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>Register Docking!</h3>
				<hr>
				<p>Input Your Document</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<form role="form">
					<div class="well">
						<div class="form-group">
							<h5>TITLE</h5>
							<input type="text" class="form-control input-lg" id="doc_title"
								name="memberPw" placeholder="Password"> <br>
						</div>
						<br>
						<div class="form-group">
							<h5>EDITOR</h5>
							<input type="text" class="form-control input-lg" id="doc_editor"
								name="memberPw" placeholder="Password"> <br>
						</div>
					</div>


					<br>

					<button type="button" class="btn btn-success" id="register_button" onclick="documentRegister()">Register</button>
				</form>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>