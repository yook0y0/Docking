<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script src="./js/member.js"></script>
</head>
<body>
<input type="button" value="회원등록" onclick="memberAdd()">
<input type="button" value="회원수정" onclick="memberModify()">
<input type="button" value="회원검색" onclick="memberSearch()">
<input type="button" value="회원삭제" onclick="memberDelete()">

</body>
</html>