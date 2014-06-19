package controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.JoinedMemberVO;
import controller.action.AddAction;

public class JoinedMemberController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req)
	{
		this.req = req;
	}

	public void setResponse(HttpServletResponse res)
	{
		this.res = res;
	}
	
	public void joinedMemberAdd() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");
		String	docId = req.getParameter("docId");

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);

		JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();

		joinedMemberVO.setKey(docId + "/" + id);
		joinedMemberVO.setDocId(docId);
		joinedMemberVO.setFlag(1);
		joinedMemberVO.setMemberId(id);

		addAction.addJoinedMember("joinedMember_add", joinedMemberVO);
		
		res.setCharacterEncoding("utf-8");

		res.sendRedirect("./startSocket?docId=" + docId);
	}

	public void joinedMember()	throws ServletException, IOException
	{
		String portNum = req.getParameter("portNum");
		String docId = req.getParameter("docId");

		req.setAttribute("docId", docId);
		req.setAttribute("portNum", portNum);

		req.getRequestDispatcher("./html/editorStartTest.jsp").forward(req, res);
	}

	public void joinedMemberModify() throws ServletException, IOException
	{

	}

	public void joinedMemberSearch() throws ServletException, IOException
	{

	}

	public void joinedMemberSearchAll() throws ServletException, IOException
	{

	}

	public void joinedMemberDelete() throws ServletException, IOException
	{

	}
}
