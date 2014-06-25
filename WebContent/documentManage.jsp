<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>

<style>
table {
  border-collapse: separate;
  border-spacing: 0 5px;
}

thead th {
  background-color: #24A6BD;
  color: white;
}

tbody td {
  background-color: #EEEEEE;
}

tr td:first-child,
tr th:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

tr td:last-child,
tr th:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Register Section +++++ -->
	<div id="page">
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
				<table class="table">
					<thead class="">
						<tr>
							<th>EDITOR</th>
							<th>TITLE</th>
							<th>DATE</th>
							<th>MANAGE</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach items="${documentList}" var="con" varStatus="status">
							<tr>
								<td>${con.type }</td>
								<td>${con.title}</td>
								<td>${con.creationDate}</td>
								<td>
									<a href="./document_updateView?id=${con.id}&writer=${con.writer}&title=${con.title}&content=${con.content}&type=${con.type}&creationDate=${con.creationDate}">Modify</a>
									/
									<a href="./document_delete?id=${con.id}">Delete</a>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
		<!-- /row -->
	</div>
	</div>

</body>
</html>