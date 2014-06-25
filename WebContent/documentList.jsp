<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>z
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Register Section +++++ -->
	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>Join to DockingEnvironment!</h3>
				<hr>
				<p>Select Your Document</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<c:forEach items="${documentList}" var="con" varStatus="status">
					<a href="./startSocket?docId=${con.id}&lastDate=0">
							${con.creationDate}/${con.writer}'s Room/${con.title}/${con.type }
					</a>
					
					<br><br>
				</c:forEach>
			</div>
		</div>
		<!-- /row -->
	</div>

</body>
</html>