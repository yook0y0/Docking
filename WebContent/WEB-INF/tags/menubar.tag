<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>

<!-- fixed navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target=".navbar-collapse">
				<span class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>

			<a class="navbar-brand">DOCKING </a>
		</div>


		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav navbar-right">
				<li><a href="start.jsp">HOME</a></li>
				<li><a onclick='getCont("document");'>DOCUMENT</a></li>

				<li><a onclick='getCont("board_list");'>REVIEW</a></li>

				<c:choose>
					<c:when test="${sessionScope.logInMember.memberName != null}">
						<c:if test="${sessionScope.logInMember.type == 1 }">
							<li><a onclick='getCont("editor");'>FOR DEVELOPER</a></li>
						</c:if>
						<li><a onclick='getContJs("user","user");'>MY INFO</a>
						<li><a href="./memberLogout">LOGOUT</a>
					</c:when>
					<c:otherwise>
						<li><a onclick='getContJs("login", "user");'>LOGIN</a>
					</c:otherwise>
				</c:choose>
			</ul>
		</div>
		<!--/.nav-collapse -->
	</div>
</div>