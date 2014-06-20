<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Projects Section +++++ -->
	<div id="page">
		<div class="container pt">
			<div class="row mt">
				<div class="col-lg-6 col-lg-offset-3 centered">
					<h3>USER INFO</h3>
					<hr>
					<p>Menu related to the user</p>
				</div>
			</div>
			<div class="row mt centered">
			<div class="col-lg-6">
					<a class="zoom green" href="./userUpdate.jsp"><img
						class="img-responsive" src="./img/user_update.png"
						alt="" /></a>
					<H3>UPDATE</H3>
				</div>
				<div class="col-lg-6">
					<a class="zoom green" href="./member_delete"><img
						class="img-responsive" src="./img/user_delete.png"
						alt="" /></a>
					<H3>DELETE</H3>
				</div>
			</div>
		</div>
	</div>
	<!-- /grey -->
	<myTag:copyright />
</body>
</html>