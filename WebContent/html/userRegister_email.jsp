<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
	function emailChk() 
	{
		var emailInfo = $("#emailInfo").val();

		$.post("../emailChk", 
		{
			emailInfo : emailInfo,
		},

		function(result) 
		{
			alert(result);

			//window.location = "userRegister.jsp";
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
				<p>Input Your Email</p>
			</div>
		</div>
		<div class="well col-lg-6 col-lg-offset-3 centered">
			<form class="form">
				<h4>Sign-up</h4>
				<div class="input-group text-center">
					<input type="text" class="form-control input-lg" placeholder="Enter your email address" id="emailInfo"> 
						<span class="input-group-btn">
						<button class="btn btn-lg btn-primary" type="button" onclick="emailChk()" id="check_buttons">CHECK</button></span>
				</div>
			</form>
		</div>
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>