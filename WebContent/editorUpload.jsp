<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
</head>
<body>
	<myTag:menubar />

	<!-- +++++ Contact Section +++++ -->

	<div class="container pt">
		<div class="row mt">
			<div class="col-lg-6 col-lg-offset-3 centered">
				<h3>UPLOAD EDITOR</h3>
				<hr>
				<p>Test Page..</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-8 col-lg-offset-2">
				<form action="./editor_add" method="post"
					enctype="multipart/form-data">
					<div class="form-group">
						<input type="name" name="editor_name" class="form-control"
							id="name" placeholder="Editor Name"> <br>
					</div>
					<div class="form-group">
						<input type="name" name="editor_info" class="form-control"
							id="name" placeholder="Editor Info"> <br>
					</div>
					<div class="form-group">
						<input type="name" name="editor_startPage" class="form-control"
							id="startPage" placeholder="Start Page Path"> <br>
					</div>
					<div class="form-group">
						<input type="name" name="editor_getMethod" class="form-control"
							id="getMethod" placeholder="getMethod name"> <br>
					</div>
					<div class="form-group">
						<input type="name" name="editor_setMethod" class="form-control"
							id="setMethod" placeholder="setMethod name"> <br>
					</div>
					<div class="form-group">
						<input type="file" name="editor_file" class="form-control">
						<br>
					</div>
					<button type="submit" class="btn btn-success">UPLOAD</button>
				</form>
			</div>
		</div>
		<!-- /row -->
	</div>
	<!-- /container -->
	<myTag:copyright />
</body>
</html>