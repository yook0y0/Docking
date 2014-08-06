<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script src="js/view/singlePageApplication.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
	<myTag:menubar />
	<div id="changeable">
	<div id="home" >
		<div class="container">
			<div class="row" id="changeable_inside">
				<div class="col-lg-8 col-lg-offset-2 centered">
					<img src="./img/docking.png" alt="DOCKING">
					<h1>Docking</h1>
					<p>Real-time working environment</p>
					
					<c:choose>
						<c:when test="${sessionScope.logInMember.memberName == null}">
							<a onclick='getContJs("login","user");'><button type="submit"
							class="btn btn-warning btn-lg">Start !</button></a>
						</c:when>
						
						<c:otherwise>
							<a onclick='getCont("document");'><button type="submit"
							class="btn btn-warning btn-lg">Start !</button></a>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
	</div>
	<!-- /home -->
	</div>
	
	<!-- Info Page -->
	<div id="white">
		<div class="container" id="slide-2" >
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
					<img src="./img/user.png" width="180" alt="">
					<h4>1 - Real-time collaboration</h4>
					<p>Collaborate with other users in real-time support.</p>
				</div>
				<!--/col-lg-4 -->

				<div class="col-lg-4">
					<img src="./img/tool.png" width="180" alt="">
					<h4>2 - add Custom Editor</h4>
					<p>The user can manually add the desired editor.</p>

				</div>
				<!--/col-lg-4 -->


				<div class="col-lg-4">
					<img src="./img/cloud.png" width="180" alt="">
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