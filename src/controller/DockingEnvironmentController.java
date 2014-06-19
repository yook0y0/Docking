package controller;

import java.io.IOException;
import java.sql.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import vo.ContentsVO;
import vo.DockingEnvironmentVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import controller.action.AddAction;

public class DockingEnvironmentController 
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
	
	public void dockingEnvironmentAdd() throws ServletException, IOException
	{	
		long 	time = System.currentTimeMillis();
		
		/*
		 * DockingEnvironmentVO
		 */
		String	docId = String.valueOf(time);
		String 	title = req.getParameter("docTitle");
		MemberVO mvo = (MemberVO)req.getSession().getAttribute("logInMember");
		String	writer = mvo.getId();
		DockingEnvironmentVO	dv = new DockingEnvironmentVO();
		dv.setDocId(docId);
		dv.setTitle(title);
		dv.setCreationDate(new Date(time));
		dv.setWriter(writer);
		
		/*
		 * ContentsVO
		 */
		String	contentsId = docId;
		String	tit = title;
		String	body = "body";
		String	type = req.getParameter("docEditor");
		String	path = "path";
		ContentsVO cv = new ContentsVO();
		cv.setContetsId(contentsId);
		cv.setTitle(tit);
		cv.setBody(body);
		cv.setType(type);
		cv.setPath(path);
		
		/*
		 * MemberContentsVO
		 */
		MemberContentsVO mv = new MemberContentsVO();
		mv.setDocId(docId);
		mv.setMemberId(writer);

		AddAction addAction = new AddAction();
		addAction.addContents("contents_add", cv);
		addAction.addDockingEnvironment("dockingEnvironment_add", dv);
		addAction.addMemberContents("memberContents_add", mv);

		/*//////////////////////////////////////////////////////////////////////////////////////////////
		JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();

		joinedMemberVO.setKey(dockingEnvironmentVO.getDocId() + "/" + memberVO.getId());
		joinedMemberVO.setDocId(dockingEnvironmentVO.getDocId());
		joinedMemberVO.setFlag(1);
		joinedMemberVO.setMemberId(memberVO.getId());

		addAction.addJoinedMember("joinedMember_add", joinedMemberVO);

		/////////////////////////////////////////////////////////////////////////////////////////////
		List<JoinedMemberVO>	joinedMemberList = searchAction.searchJoinedMemberList("joinedMember_searchAll", dockingEnvironmentVO.getDocId());
		getServletContext().setAttribute("joinedMemberList", joinedMemberList);
		/////////////////////////////////////////////////////////////////////////////////////////////

		SocketIO	socketIO = (SocketIO)getServletContext().getAttribute("socketIO");

		int		portNum = -(int)time;
		portNum %= 51000;

		socketIO.setPort(portNum);
		socketIO.start(Vertx.newVertx());

		System.out.println(portNum);

		/////////////////////////////////////////////////////////////////////////////////////////////

		req.setAttribute("docId", dockingEnvironmentVO.getDocId());
		req.setAttribute("portNum", portNum);

		req.getRequestDispatcher("./html/start.jsp").forward(req, res);*/
		res.setCharacterEncoding("utf-8");
		res.getWriter().println("success");
		res.getWriter().flush();
	}

	public void dockingEnvironmentModify() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentSearch() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentSearchAll() throws ServletException, IOException
	{

	}

	public void dockingEnvironmentDelete() throws ServletException, IOException
	{

	}
}
