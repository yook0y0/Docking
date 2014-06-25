<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
 function modify()
 {
	var reviewId = $("#reviewId").val();
	var editor = $("#editor").val();
	var writer = $("#writer").val();
	var review = $("#review").val();
	var score = $("#score").val();
	
	$.post("./editorReview_modify", 
	{ 
		reviewId: reviewId,
		editor: editor,
		writer: writer,
		review: review,
		score: score
	},
	
	function(result) 
	{	
		window.location = "./editorReview_entire";
	});
};
function showValue(newValue)
{
	document.getElementById("range").innerHTML=newValue;
}
</script>
</head>
<body>
	<myTag:menubar />
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<!-- +++++ Modify Section +++++ -->
	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>Modify Docking!</h3>
				<hr>
				<p>Modify Your Information</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-8 col-lg-offset-2">
				<form role="form">

					<div class="form-group">
						reviewId : <input type="text" class="form-control" id="reviewId"
							name="reviewId" value="${requestScope.ervo.reviewId}" readonly>
						<br>
					</div>

					<div class="form-group">
						editor : <input type="text" class="form-control" id="editor"
							name="editor" value="${requestScope.ervo.editor}" readonly> <br>
					</div>

					<div class="form-group">
						writer : <input type="text" class="form-control" id="writer"
							name="writer" value="${requestScope.ervo.writer}" readonly>
						<br>
					</div>

					<div class="form-group">
						review : <input type="text" class="form-control" id="review"
							name="review" value="${requestScope.ervo.review}"> <br>
					</div>

					<div class="form-group">
						score :  
							<span id="range">${requestScope.ervo.score}</span>
							<input type="range"  min="0" max="10" class="form-control input-lg" id="score"
							name="score" onchange="showValue(this.value)" value="${requestScope.ervo.score}"/>
							<br>
					</div>

					<br>

					<button type="button" class="btn btn-success" id="modify_button"
						onclick="modify()">Modify</button>
					<button type="button" class="btn btn-success" id="cancel_button">cancel</button>
				</form>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>