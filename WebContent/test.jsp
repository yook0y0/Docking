<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<link rel='stylesheet' type='text/css' href='css/bootstrap.css' />
<link rel='stylesheet' type='text/css' href='css/main.css' />

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script src="http://code.jquery.com/jquery-1.10.2.js"></script>

</head>

<body>
	<c:import url="http://localhost:8089/Docking/getEditorCode?path=${requestScope.eeivo.startPage}&editorId=${requestScope.eeivo.editorId}" />
</body>
</html>