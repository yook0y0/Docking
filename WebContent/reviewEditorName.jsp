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
	<center><h1>EDITOR REVIEW LIST</h1></center>
		<c:forEach items="${requestScope.editorReviewList}" var="con" varStatus="status">
			<div class="container">
				<div class="row">
					<div class="col-lg-8 col-lg-offset-2">
					----------------------------------------------------------------------------------------------------
						<p>
							<bd>date : ${con.writtenDate}</bd>
						</p>
						<p>
							writer : ${con.reviewId}
							<br>
						</p>
						
						<h4>score : ${con.score}</h4>
						<p>review : ${con.review}</p>
					</div>
				</div>
			</div>
		</c:forEach>
	</div>
	<myTag:copyright />
</body>
</html>