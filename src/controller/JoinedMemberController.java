package controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.JoinedMemberVO;
import vo.MemberVO;
import controller.action.AddAction;
import controller.action.SearchAction;

public class JoinedMemberController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void joinedMemberAdd() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");
		String	docId = req.getParameter("docId");
		String	portNum = req.getParameter("portNum");

		String	sendMessage = "Send Invite Message";
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		MemberVO	memberVO = searchAction.searchMember("member_search", id);

		try
		{
			AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);

			JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();

			joinedMemberVO.setKey(docId + "/" + memberVO.getId());
			joinedMemberVO.setDocId(docId);
			joinedMemberVO.setFlag(1);
			joinedMemberVO.setMemberId(memberVO.getId());

			addAction.addJoinedMember("joinedMember_add", joinedMemberVO);

			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*			List<JoinedMemberVO>	joinedMemberList = searchAction.searchJoinedMemberList("joinedMember_searchAll", docId);
			getServletContext().setAttribute("joinedMemberList", joinedMemberList);
*/			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
		catch(RuntimeException e)
		{
			sendMessage = "Already Invited Member!";
		}

		//	String url = "http://localhost:8089/Docking/joinedMember" + "?" + "docId=" + docId + "&portNum=" + portNum;
		//	System.out.println(url);

		res.setCharacterEncoding("utf-8");
		PrintWriter	writer = res.getWriter();

		writer.println(sendMessage);
		writer.flush();
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
