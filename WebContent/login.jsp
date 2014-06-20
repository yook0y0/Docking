<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
	function loginChk() {
		var memberId = $("#id_memberId").val();
		var memberPw = $("#id_memberPw").val();

		$.post("./login", 
				{ 
					memberId: memberId,
					memberPw: memberPw,
				},
				
				function(result) 
				{	
					console.log(result);
					window.location = "start.jsp";
		});
	};
</script>
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Login page +++++ -->
	<div id="loginPage">
		<div class="container">
			<div class="row">
				<div class="col-sm-6 col-md-4 col-md-offset-4">
					<h1 class="text-center login-title">Sign in to continue to
						Docking</h1>
					<div class="account-wall">
						<img class="profile-img"
							src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
							alt="">
						<form class="form-signin">

							<input type="text" id="id_memberId" class="form-control"
								placeholder="Email" required autofocus> <input
								type="password" id="id_memberPw" class="form-control"
								placeholder="Password" required>
							<button class="btn btn-lg btn-primary btn-block"
								id="login_button" type="button" onclick="loginChk()">Sign in</button>


							<!-- <label class="checkbox pull-left"> <input type="checkbox"
							value="remember-me"> Remember me -->
							<!-- </label> <a href="#" class="pull-right need-help">Need help? </a><span
							class="clearfix"></span> -->
						</form>
					</div>
					<a href="./userRegister.jsp" class="text-center new-account">Create an account </a>
				</div>
			</div>
		</div>
	</div>
	<myTag:copyright />
</body>
</html>