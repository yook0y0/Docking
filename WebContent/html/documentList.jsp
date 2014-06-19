<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
	function documentRegister() {
		var docTitle = $("#doc_title").val();
		var docEditor = $("#doc_editor").val();

		console.log(docTitle);
		console.log(docEditor);
		$.post("../dockingEnvironment_add", {
			docTitle : docTitle,
			docEditor : docEditor,
		},

		function(result) {
			alert(result);

			window.location = "start.jsp";
		});
	};
</script>
</head>
<body>
	<myTag:menubar />
	<!-- +++++ Register Section +++++ -->
	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>Register Docking!</h3>
				<hr>
				<p>Input Your Document</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3">
				<c:forEach items="${contentsList}" var="con" varStatus="status">
					<a href="./startSocket?docId=${con.docId}">
					docId : ${con.docId} // title : ${con.title} // date : ${con.creationDate} // writer : ${con.writer}
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