<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
				<h3>modify Editor Code!</h3>
				<hr>
				<p>Input Your Document</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<c:forEach items="${editorCodeList}" var="con" varStatus="status">
					<a href="./editorCode_search?path=${con.path}">
					path : ${con.path}
					</a><br><br>
				</c:forEach>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>