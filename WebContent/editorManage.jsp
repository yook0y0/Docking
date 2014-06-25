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
				<h3>Manage Your Editor!</h3>
				<hr>
				<p>Modify Your Editor</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<table class="table">
					<thead class="">
						<tr>
							<th>EDITOR</th>
							<th>INFOMATION</th>
							<th>MANAGE</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach items="${evoList}" var="e" varStatus="status">
							<tr>
								<td>${e.name }</td>
								<td>${e.info}</td>
								<td>
									<a href="./editorCode_list?name=${e.name}">CodeManage</a>
									/
									<a href="./editor_updateView?director=${e.director}&name=${e.name}&info=${e.info}&startPage=${e.startPage}&getMethod=${e.getMethod}&setMethod=${e.setMethod}">Modify</a>
									/
									<a href="./editor_delete?name=${e.name}">Delete</a>
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
	<!-- /container -->
	<myTag:copyright />
</body>
</html>