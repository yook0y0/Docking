<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">
<head>
	<%@ include file="import.html"%>
	<title>DOCKING - Real-time working environment</title>
</head>
<body>
	<section id="container">
		<!-- **********************************************************************************************************************************************************
      TOP BAR CONTENT & NOTIFICATIONS
      *********************************************************************************************************************************************************** -->
		<!--header start-->
		<header class="header black-bg">
			<div class="sidebar-toggle-box">
				<div class="fa fa-bars tooltips" data-placement="right"
					data-original-title="Toggle Navigation"></div>
			</div>
			<!--logo start-->
				<a href="./main.jsp" class="logo"><b>DOCKING</b></a>


<!--  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////   -->	

			<!--logo end-->
			
			
			
			
<!--  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////   -->		
			<div class="top-menu">
				<ul class="nav pull-right top-menu" id="login_ul">
					<c:choose>
						<c:when test="${sessionScope.logInMember.memberId == null}">
							<li style="margin: 20% -15%">
								<div class="btn-group">
									<button type="button" class="btn btn-theme dropdown-toggle"
										onclick='getContJs("login","member")'>LOGIN</button>
								</div>
							</li>
						</c:when>

						<c:otherwise>
							<li>
							<li style="margin: 5% -5%">
								<div class="btn-group">
									<button type="button" class="btn btn-theme dropdown-toggle"
										data-toggle="dropdown">
										<c:out value="${sessionScope.logInMember.memberId}"></c:out>
										<span class="caret"></span>
									</button>
									<ul class="dropdown-menu" role="menu">
										<li>MY INFO</li>
										<li class="divider"></li>
										<li><a onclick="memberSearch()">UPDATE</a></li>
										<li><a onclick="memberLogout()">LOGOUT</a></li>
									</ul>
								</div>
							</li>
						</c:otherwise>
					</c:choose>
				</ul>
			</div>
		</header>
		<!--header end-->

		<!-- **********************************************************************************************************************************************************
      MAIN SIDEBAR MENU
      *********************************************************************************************************************************************************** -->
		<!--sidebar start-->
		<aside>
			<div id="sidebar" class="nav-collapse ">
				<!-- sidebar menu start-->
				<ul class="sidebar-menu" id="nav-accordion">
					<li class="sub-menu"><a onclick="getCont('main');"> <i
							class="fa fa-home"></i> <span>HOME</span>
					</a>
					<li class="sub-menu"><a
						onclick='getJoinedDocumentList()'> <i
							class="fa fa-book"></i> <span>DOCUMENT</span>
					</a>
					<li class="sub-menu"><a onclick='getReviewList()'>
							<i class="fa fa-th"></i> <span>REVIEW</span>
					</a>
					
					<c:if test="${sessionScope.logInMember.type == 1 }">
						<li class="sub-menu"><a onclick='getOwnEditorList()'>
							<i class="fa fa-desktop"></i> <span>FOR DEVELOPER</span>
							</a>
					</c:if>
					
				</ul>
				<!-- sidebar menu end-->
			</div>
		</aside>
		<!--main content end-->

	</section>

	<!-- js placed at the end of the document so the pages load faster -->
	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/jquery-1.8.3.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<script class="include" type="text/javascript"
		src="assets/js/jquery.dcjqaccordion.2.7.js"></script>
	<script src="assets/js/jquery.scrollTo.min.js"></script>
	<script src="assets/js/jquery.nicescroll.js" type="text/javascript"></script>
	<script src="assets/js/jquery.sparkline.js"></script>


	<!--common script for all pages-->
	<script src="assets/js/common-scripts.js"></script>

	<script type="text/javascript"
		src="assets/js/gritter/js/jquery.gritter.js"></script>
	<script type="text/javascript" src="assets/js/gritter-conf.js"></script>

	<!--script for this page-->
	<script src="assets/js/sparkline-chart.js"></script>
	<script src="assets/js/zabuto_calendar.js"></script>

	<script type="application/javascript">
        $(document).ready(function () 
       	{
  			$('select.styled').customSelect();
            $("#date-popover").popover({html: true, trigger: "manual"});
            $("#date-popover").hide();
            $("#date-popover").click(function (e) {
                $(this).hide();
            });
        });
	</script>
	<div id="changeable_inside">
		<%@ include file="js/templates/main_template.html"%>
	</div>
</body>
</html>
