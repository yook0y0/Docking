<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
	$('#register_button')
			.click(
					function(event) {
						var memberId = $("#id_memberId").val();
						var memberPw = $("#id_memberPw").val();
						var memberNickName = $("#id_memberNickName").val();
						var memberType = document
								.querySelector('input[name="memberType"]:checked').value;
						;

						$.post("../member_add", {
							memberId : memberId,
							memberPw : memberPw,
							memberNickName : memberNickName,
							memberType : memberType,
						},

						function(result) {
							alert(result);

							window.location = "start.jsp";
						});
					});
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
				<p>Input Your Information</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<form role="form">
					<!-- <div class="form-group">
						ID<input type="email" class="form-control" id="id_memberId"
							name="memberId" placeholder="Email"> <br>
					</div> -->
					<div class="well">
						<form class="form">
							<h5>EMAIL</h5>
							<div class="input-group text-center">
								<input type="text" class="form-control input-lg"
									id="id_memberId" placeholder="Enter your email address">
								<span class="input-group-btn"><button
										class="btn btn-lg btn-primary" type="button">CHECK</button></span>
							</div>
						</form>
						<br>
						<div class="form-group">
							<h5>PASSWORD</h5>
							<input type="text" class="form-control input-lg" id="id_memberPw"
								name="memberPw" placeholder="Password"> <br>
						</div>

						<div class="form-group">
							<h5>NICKNAME</h5>
							<input type="text" class="form-control input-lg"
								id="id_memberNickName" name="memberNickName"
								placeholder="NickName"> <br>
						</div>

						<div class="form-group">
							<h5>USER TYPE</h5>
							<br> <input type="radio" name="memberType" value="0" checked>
							User &nbsp; &nbsp; <input type="radio" name="memberType"
								value="1"> Developer &nbsp; &nbsp; <br>
						</div>
					</div>


					<br>

					<button type="button" class="btn btn-success" id="register_button">Register</button>
				</form>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />

	<script src="../assets/js/register.js"></script>
</body>
</html>