<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- fixed navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target=".navbar-collapse">
				<span class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			
			<a class="navbar-brand">DOCKING
			</a>				
		</div>

		
		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav navbar-right">
 				<li><a href="start.jsp">HOME</a></li>
<!--				<li><a id="menu-link-2" href="#slide-2">ABOUT US</a></li> -->
				<li><a href="document.jsp">DOCUMENT</a></li>
				
				<li><a href="board.jsp">BOARD</a></li>
				<li><a href="contact.jsp">CONTACT</a></li>
				
						<c:choose>
							<c:when test="${sessionScope.logInMember.nickName != null}">
								<li><a href="../logout">LOGOUT</a>
								<li><a href="userUpdate.jsp">ChangeInfo</a>
								
								<c:if test="${sessionScope.logInMember.memberType == 1 }">
									<li><a href="editor.jsp">EDITOR</a></li>
								</c:if>
							</c:when>
							<c:otherwise>
								<li><a href="login.jsp">LOGIN</a>
							</c:otherwise>
						</c:choose>
			</ul>
		</div>
		<!--/.nav-collapse -->
	</div>
</div>