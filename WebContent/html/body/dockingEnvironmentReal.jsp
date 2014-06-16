<%@page import="vo.JoinedMemberVO"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%-- <div>
	<table id="register_movie" class="table">
		<c:forEach var="item" items="${applicationScope.joinedMember}">
			<tr id="${item.code}" class="eventCheckRow">
				<td>${item.code}</td>
				<td>${item.infoName }</td>
				<td>${item.description }</td>
				<td>${item.dataPath }</td>
				<td>${item.movieCast }</td>
				<td>${item.filmmaker }</td>
				<td>${item.duration }</td>
				<td>${item.srcUrl }</td>
			</tr>
		</c:forEach>
	</table>
</div> --%>

<%
 	request.setCharacterEncoding("UTF-8");

	Map<String,List<JoinedMemberVO>>	joinedMemberList = (Map<String,List<JoinedMemberVO>>)getServletContext().getAttribute("joinedMember");

 	for(JoinedMemberVO vo : joinedMemberList.get("sdf@sdf"))
 	{
 		out.println("<br><br><br><br><br><br>");
 		out.println("<div>" + vo + "<div>");	
 	}
%>

<script src="../assets/js/dockingEnvironment.js"></script>