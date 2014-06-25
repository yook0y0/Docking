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
				<h3>Manage Your Editor!</h3>
				<hr>
				<p>Modify Your Editor</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<c:forEach items="${evoList}" var="e" varStatus="status">
					name : ${e.name} / info : ${e.info}
					<br>
					<a href="./editorCode_list?name=${e.name}">코드수정</a>
					<a href="./editor_updateView?director=${e.director}&name=${e.name}&info=${e.info}&startPage=${e.startPage}&getMethod=${e.getMethod}&setMethod=${e.setMethod}">정보수정</a>
					<a href="./editor_delete?name=${e.name}">삭제</a>
					<br><br>
				</c:forEach>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>