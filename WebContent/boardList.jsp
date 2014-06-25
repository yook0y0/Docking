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
	<div id="boardPage">
	<center><h2><a href="./getAllEditor2">REVIEW REGISTER</a></h2></center>
		<c:forEach items="${entireEditorReview}" var="con" varStatus="status">
			<div class="container">
				<div class="row">
					<div class="col-lg-8 col-lg-offset-2">
					----------------------------------------------------------------------------------------------------
						<p>
							<bd>date : ${con.writtenDate}</bd>
						</p>
						<p>
							writer : ${con.writer}
							<br>
						</p>
						
						<p>editor : ${con.editor }</p>
						<h4>score : ${con.score}</h4>
						<p>review : ${con.review}</p>
						
						<c:if test="${sessionScope.logInMember.id == con.writer}">
						<a href="./editorReview_modify?reviewId=${con.reviewId}&editor=${con.editor}&writer=${con.writer}&review=${con.review}&score=${con.score}">MODIFY</a>
						<br>
						<a href="./editorReview_delete?reviewId=${con.reviewId}">DELETE</a>
						</c:if>
					</div>

				</div>
				<!-- /row -->
			</div>
			<!-- /container -->
			</c:forEach>
	</div>
	<myTag:copyright />
</body>
</html>