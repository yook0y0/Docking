<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="myTag" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ include file="import.html"%>
<script>
 function modify(){
		
			var director = $("#director").val();
			var name = $("#name").val();
			var info = $("#info").val();
			var startPage = $("#startPage").val();
			var getMethod = $("#getMethod").val();
			var setMethod = $("#setMethod").val();
			
			
			$.post("./editor_modify", 
					{ 
				director: director,
				name: name,
				info: info,
				startPage: startPage,
				getMethod: getMethod,
				setMethod: setMethod
					},
					
					function(result) 
					{	
						console.log(result);
					}
			);
		};

		/* $('#delete_button').click(function(event)
		{
			var memberId = $("#modify_memberId").val();
			var con = confirm("Do you really want to quit docking?");
		 	
			if(con == true)
			{
				$.post("../member_delete", 
						{ 
							memberId: memberId,
						},
						
						function(result) 
						{	
							alert(result);	
							
							window.location = "start.jsp";	
						}
				);
		 	}
			
			else{}
		}); */
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
				<p>Modify Your Editor Information</p>
			</div>
		</div>
		<div class="row mt">
			<div class="col-lg-8 col-lg-offset-2">
				<form role="form">

					<div class="form-group">
						director : <input type="text" class="form-control" id="director"
							name="director" value="${requestScope.evo.director}" readonly>
						<br>
					</div>

					<div class="form-group">
						name : <input type="text" class="form-control" id="name"
							name="name" value="${requestScope.evo.name}" readonly> <br>
					</div>

					<div class="form-group">
						info : <input type="text" class="form-control" id="info"
							name="info" value="${requestScope.evo.info}"> <br>
					</div>

					<div class="form-group">
						startPage : <input type="text" class="form-control" id="startPage"
							name="startPage" value="${requestScope.evo.startPage}"> <br>
					</div>

					<div class="form-group">
						getMethod : <input type="text" class="form-control" id="getMethod"
							name="getMethod" value="${requestScope.evo.getMethod}"> <br>
					</div>

					<div class="form-group">
						setMethod : <input type="text" class="form-control" id="setMethod"
							name="setMethod" value="${requestScope.evo.setMethod}"> <br>
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