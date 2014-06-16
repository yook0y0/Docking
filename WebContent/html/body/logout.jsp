<!-- <script>
function logout()
{
 	var con = confirm("접속을 종료하시겠습니까");
 	
	if(con == true)
	{
  		location.href="../ajax/logout.jsp";
  
 	}
	
	else{}
}
</script> -->

<%@page import="vo.MemberVO"%>
<%@page import="java.util.List"%>

<%
 request.setCharacterEncoding("UTF-8");

 List<MemberVO>	logInMemberList = (List<MemberVO>)getServletContext().getAttribute("logInMemberList");

 logInMemberList.remove(session.getAttribute("logInMember"));
 
 session.removeAttribute("logInMember");

 response.sendRedirect("../start.jsp");

%>