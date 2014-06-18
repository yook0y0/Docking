<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>

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
			<div class="col-lg-8 col-lg-offset-2">
				<form role="form">

					<div class="form-group">
						<input type="email" class="form-control" id="id_memberId"
							name="memberId" placeholder="Email"> <br>
					</div>

					<div class="form-group">
						<input type="text" class="form-control" id="id_memberPw"
							name="memberPw" placeholder="Password"> <br>
					</div>

					<div class="form-group">
						<input type="text" class="form-control" id="id_memberNickName"
							name="memberNickName" placeholder="NickName"> <br>
					</div>

					<div class="form-group">
						<input type="radio" name="memberType" value="0" checked>
						User &nbsp; &nbsp; <input type="radio" name="memberType" value="1">
						Developer &nbsp; &nbsp; <br>
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