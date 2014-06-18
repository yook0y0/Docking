<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<script src="../assets/js/socketIO.js"></script>
<script src="../assets/js/socket.io.js"></script>

<input type="hidden" id="docId" value="${applicationScope.docId}" />
<input type="hidden" id="masterId" value="${applicationScope.masterId }" />
<input type="hidden" id="portNum" value="${applicationScope.portNum }" />

<br><br><br><br>

<div>
	<table id="joinedMember_list" class="table">
		<c:forEach var="item" items="${applicationScope.joinedMemberList }">
			<tr id="${item.memberId}" class="eventCheckRow">
				<td>${item.memberId}</td>
			</tr>
		</c:forEach>
	</table> 
</div>

<button id="invite_button" type="button">Invite!</button>

<%-- <%@ include file="../../_start_.jsp" %> --%>

<script src="../assets/js/dockingEnvironment.js"></script>