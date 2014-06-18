<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
</head>
<body>
	<myTag:menubar />
	<!-- .navbar-toggle is used as the toggle for collapsed navbar content -->
	<!-- +++++ Welcome Section +++++ -->
	<div id="home">
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-lg-offset-2 centered">
					<img src="../assets/img/docking.png" alt="DOCKING">
					<h1>Docking</h1>
					<p>Real-time working environment</p>
					<a href="../html/login.jsp"><button type="submit"
							class="btn btn-warning btn-lg">Start !</button></a>
				</div>
				<!-- /col-lg-8 -->
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
		<!-- /container -->
	</div>
	<!-- /home -->

	<!-- Info Page -->
	<div id="white">
		<div class="container" id="slide-2">
			<div class="row mt centered">
				<div class="col-lg-6 col-lg-offset-3">
					<h1>
						Docking<br />provides services
					</h1>
				</div>
			</div>
			<!-- /row -->

			<div class="row mt centered">
				<div class="col-lg-4">
					<img src="../assets/img/user.png" width="180" alt="">
					<h4>1 - Real-time collaboration</h4>
					<p>Collaborate with other users in real-time support.</p>
				</div>
				<!--/col-lg-4 -->

				<div class="col-lg-4">
					<img src="../assets/img/tool.png" width="180" alt="">
					<h4>2 - add Custom Editor</h4>
					<p>The user can manually add the desired editor.</p>

				</div>
				<!--/col-lg-4 -->


				<div class="col-lg-4">
					<img src="../assets/img/cloud.png" width="180" alt="">
					<h4>3 - Cloud Service</h4>
					<p>All documents provided as a cloud service</p>

				</div>
				<!--/col-lg-4 -->
			</div>
			<!-- /row -->
		</div>
		<!-- /container -->
	</div>
	<!-- /grey -->
	<myTag:copyright />
</body>
</html>