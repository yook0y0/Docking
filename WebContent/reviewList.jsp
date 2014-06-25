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
	<center><h1>CHECK YOUR EDITOR SCORE!</h1></center>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-lg-offset-2">
				
		<h3>Text Editor</h3>
		------------------------------------------------------------------>
		<table>
			<tr>
			<td><ba>EditorName</ba></td>
			<td><bd>............................................................................................</bd></td>
			<td><bd>totalScore</bd></td>
			</tr>
			<c:forEach items="${requestScope.developerReviewList}" var="con" varStatus="status">
				<c:if test="${con.editorType == 1 }">
					<tr>
						<td><a href="./editorReview_search?editorName=${con.editorName }">${con.editorName }</a></td>
						<td><bd>............................................................................................</bd></td>
						<td>${con.totalScore }</td>
					</tr>
				</c:if>
			</c:forEach>
		</table>
		
		<h3>Mind Map</h3>
		------------------------------------------------------------------>
		<table>
			<tr>
			<td><ba>EditorName</ba></td>
			<td><bd>............................................................................................</bd></td>
			<td><bd>totalScore</bd></td>
			</tr>
			<c:forEach items="${requestScope.developerReviewList}" var="con" varStatus="status">
				<c:if test="${con.editorType == 2 }">
						<tr>
							<td><a href="./editorReview_search?editorName=${con.editorName }">${con.editorName }</a></td>
							<td><bd>............................................................................................</bd></td>
							<td>${con.totalScore }</td>
						</tr>
				</c:if>
			</c:forEach>
		</table>
		
		<h3>Questionnaire</h3>
		------------------------------------------------------------------>
			<table>
				<tr>
				<td><ba>EditorName</ba></td>
				<td><bd>............................................................................................</bd></td>
				<td><bd>totalScore</bd></td>
				</tr>
				<c:forEach items="${requestScope.developerReviewList}" var="con" varStatus="status">
					<c:if test="${con.editorType == 3 }">
							<tr>
								<td><a href="./editorReview_search?editorName=${con.editorName }">${con.editorName }</a></td>
								<td><bd>............................................................................................</bd></td>
								<td>${con.totalScore }</td>
							</tr>
					</c:if>
				</c:forEach>
			</table>
		
		<h3>Else</h3>
		------------------------------------------------------------------>
			<table>
				<tr>
				<td><ba>EditorName</ba></td>
				<td><bd>............................................................................................</bd></td>
				<td><bd>totalScore</bd></td>
				</tr>
				<c:forEach items="${requestScope.developerReviewList}" var="con" varStatus="status">
					<c:if test="${con.editorType == 4 }">
							<tr>
								<td><a href="./editorReview_search?editorName=${con.editorName }">${con.editorName }</a></td>
								<td><bd>............................................................................................</bd></td>
								<td>${con.totalScore }</td>
							</tr>
					</c:if>
				</c:forEach>
			</table>
		
						<%-- <p>
							${con.reviewId} <img src="img/user.png" width="50px"
								height="50px">
							<ba>writer : ${con.writer}</ba>
						</p>
						<p>
							<bd>date : ${con.writtenDate}</bd>
						</p>
						<h3>editor : ${con.editor}</h3>
						<h4>score : ${con.score}</h4>
						<p>review : ${con.review}</p>
						<!-- <a href="start.jsp">Continue Reading...</a> -->
						<c:if test="${sessionScope.logInMember.id == con.writer}">
							<a href="./editorReview_modify?reviewId=${con.reviewId}&editor=${con.editor}&writer=${con.writer}&review=${con.review}&score=${con.score}">MODIFY</a>
								<br>
							<a href="./editorReview_delete?reviewId=${con.reviewId}">DELETE</a>
						</c:if> --%>
					</div>
				</div>
			</div>
					<br><br><br>
	</div>
	<myTag:copyright />
</body>
</html>