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
				    ID : 
				    <input type="email" class="form-control" id="modify_memberId" name="memberId" value="${sessionScope.logInMember.id }" readonly>
				    <br>
				  </div>
				  
				  <div class="form-group">
				  	PW : 
				    <input type="text" class="form-control" id="modify_memberPw" name="memberPw" value="${sessionScope.logInMember.pw }">
				    <br>
				  </div>
				  
				  <div class="form-group">
				  	NICKNAME : 
				    <input type="text" class="form-control" id="modify_memberNickName" name="memberNickName" value="${sessionScope.logInMember.nickName }">
				    <br>
				  </div>
				  
				  <div class="form-group">
				    <input type = "radio" name = "memberType" value = "0" ${sessionScope.logInMember.memberType=='0'?'checked':''}> User &nbsp; &nbsp;
		     		<input type = "radio" name = "memberType" value = "1" ${sessionScope.logInMember.memberType=='1'?'checked':''}> Developer &nbsp; &nbsp;
				    <br>
				  </div>

				    <br>
				    
				  <button type="button" class="btn btn-success" id="modify_button">Modify</button>
				  <button type="button"	class="btn btn-success" id="delete_button">Quit Docking</button>
				</form>    			
			</div>
		</div><!-- /row -->
	</div><!-- /container -->
	
	<script src="../assets/js/modify.js"></script>