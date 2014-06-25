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
				<h3>Manage Your Document!</h3>
				<hr>
				<p>Modify Your Document</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<c:forEach items="${documentList}" var="con" varStatus="status">
					date : ${con.creationDate} // title : ${con.title} // type : ${con.type}
					<br>
					<a href="./document_updateView?id=${con.id}&writer=${con.writer}&title=${con.title}&content=${con.content}&type=${con.type}&creationDate=${con.creationDate}">Modify</a>
					<a href="./document_delete?id=${con.id}">Delete</a>
					<br><br>
				</c:forEach>
			</div>
		</div>
		<!-- /row -->
	</div>

</body>
</html>