package controller.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.vertx.java.core.Vertx;

import SocketIO.SocketIO;


import controller.DockingEnvironmentController;
import controller.JoinedMemberController;
import controller.MemberController;

import vo.DockingEnvironmentVO;
import vo.JoinedMemberVO;
import vo.MemberVO;

@WebServlet(name="DiapatcherServlet", urlPatterns={
		"/login",
		"/member_add", "/member_modify", "/member_search", "/member_searchAll", "/member_delete",
		"/contents_add", "/contents_modify", "/contents_search", "/contents_searchAll", "/contents_delete",
		"/temp_add", "/temp_modify", "/temp_search", "/temp_searchAll", "/temp_delete",
		"/joinedmember_add", "/joinedmember_modify", "/joinedmember_search", "/joinedmember_searchAll", "/joinedmember_delete",
		"/dockingEnvironment_add", "/dockingEnvironment_modify", "/dockingEnvironment_search", "/dockingEnvironment_searchAll", "/dockingEnvironment_delete"
})
public class DispatcherServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		process(request,response);
	}

	private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{	
		String	uri = request.getRequestURI();
		int		lastIndex = uri.lastIndexOf("/");
		String	action = uri.substring(lastIndex + 1);
		
		request.setCharacterEncoding("utf-8");
		
		if(action.equals("test"))
		{

		}
		
		else if(action.equals("login"))
		{
			login(request,response);
		}

		/////////////////////////////////////////////// MemberRequest ///////////////////////////////////////////////
		else if(action.equals("member_add"))
		{
			memberAdd(request,response);
		}

		else if(action.equals("member_modify"))
		{
			memberModify(request,response);
		}

		else if(action.equals("member_search"))
		{
			memberSearch(request,response);
		}

		else if(action.equals("member_searchAll"))
		{
			memberSearchAll(request,response);
		}

		else if(action.equals("member_delete"))
		{
			memberDelete(request,response);
		}

		/////////////////////////////////////////////// ContentsRequest ///////////////////////////////////////////////
		else if(action.equals("contents_add"))
		{
			contentsAdd(request,response);
		}

		else if(action.equals("contents_modify"))
		{
			contentsModify(request,response);
		}

		else if(action.equals("contents_search"))
		{
			contentsSearch(request,response);
		}

		else if(action.equals("contents_searchAll"))
		{
			contentsSearchAll(request,response);
		}

		else if(action.equals("contents_delete"))
		{
			contentsDelete(request,response);
		}

		/////////////////////////////////////////////// TempRequest ///////////////////////////////////////////////
		else if(action.equals("temp_add"))
		{
			tempAdd(request,response);
		}

		else if(action.equals("temp_modify"))
		{
			tempModify(request,response);
		}

		else if(action.equals("temp_search"))
		{
			tempSearch(request,response);
		}

		else if(action.equals("temp_searchAll"))
		{
			tempSearchAll(request,response);
		}

		else if(action.equals("temp_delete"))
		{
			tempDelete(request,response);
		}

		/////////////////////////////////////////////// JoinedMemberRequest ///////////////////////////////////////////////
		else if(action.equals("joinedmember_add"))
		{
			joinedmemberAdd(request,response);
		}

		else if(action.equals("joinedmember_modify"))
		{
			joinedmemberModify(request,response);
		}

		else if(action.equals("joinedmember_search"))
		{
			joinedmemberSearch(request,response);
		}

		else if(action.equals("joinedmember_searchAll"))
		{
			joinedmemberSearchAll(request,response);
		}

		else if(action.equals("joinedmember_delete"))
		{
			joinedmemberDelete(request,response);
		}

		/////////////////////////////////////////////// DockingEnvironmentRequest ///////////////////////////////////////////////
		else if(action.equals("dockingEnvironment_add"))
		{
			dockingEnvironmentAdd(request,response);
		}

		else if(action.equals("dockingEnvironment_modify"))
		{
			dockingEnvironmentModify(request,response);
		}

		else if(action.equals("dockingEnvironment_search"))
		{
			dockingEnvironmentSearch(request,response);
		}

		else if(action.equals("dockingEnvironment_searchAll"))
		{
			dockingEnvironmentSearchAll(request,response);
		}

		else if(action.equals("dockingEnvironment_delete"))
		{
			dockingEnvironmentDelete(request,response);
		}

		if((String)request.getAttribute("dispatchUrl") != null)
		{
			RequestDispatcher	rd = request.getRequestDispatcher((String)request.getAttribute("dispatchUrl"));
			rd.forward(request, response);
		}
	}
	
	//////////////////////////////////////////////////// Socket ////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////// Login ////////////////////////////////////////////////////
	@SuppressWarnings("unchecked")
	private void login(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");
		
		String	sendMessage = "LOGIN SUCCESS!";
		
		HttpSession	session = null;
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = memberController.search("member_search", id);
		
		if(memberVO != null)
		{
			if(memberVO.getPw().equals(pw))
			{
				session = request.getSession();
				
				session.setAttribute("logInMember", memberVO);
				
				List<MemberVO>	logInMemberList = (List<MemberVO>)getServletContext().getAttribute("logInMemberList");
				
				logInMemberList.add((MemberVO)session.getAttribute("logInMember"));
				
								System.out.println("현재회원 : " + logInMemberList);
			}
			
			else
			{
				sendMessage = "LOGIN FAIL!";
			}
		}
		
		else
		{
			sendMessage = "LOGIN FAIL!";
		}
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}


	//////////////////////////////////////////////////// MemberRequest ////////////////////////////////////////////////////
	@SuppressWarnings("unchecked")
	private void memberAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{			
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");
		String	nickName = request.getParameter("memberNickName");
		String	type = request.getParameter("memberType");
		
		String	sendMessage = "REGISTER FINISHED";
		
		HttpSession	session = null;
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = new MemberVO();
		
		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));
		
		if(memberController.search("member_search", id) != null)
		{
			sendMessage = "ID DUPLICATION!!";
		}
		
		else
		{
			memberController.add("member_add", memberVO);
			
			session = request.getSession();
			
			session.setAttribute("logInMember", memberVO);
			
			List<MemberVO>	logInMemberList = (List<MemberVO>)getServletContext().getAttribute("logInMemberList");
			
			logInMemberList.add((MemberVO)session.getAttribute("logInMember"));
			
							System.out.println("현재회원 : " + logInMemberList);
		}
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}

	@SuppressWarnings("unchecked")
	private void memberModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	pw = request.getParameter("memberPw");
		String	nickName = request.getParameter("memberNickName");
		String	type = request.getParameter("memberType");
		
		String	sendMessage = "MODIFY FINISHED";
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = new MemberVO();
		
		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));
		
		memberController.modify("member_modify", memberVO);
		
		HttpSession	session = request.getSession();
		
		session.setAttribute("logInMember", memberVO);
		
		List<MemberVO>	logInMemberList = (List<MemberVO>)getServletContext().getAttribute("logInMemberList");
		
		logInMemberList.remove(memberController.search("member_search", id));
		logInMemberList.add((MemberVO)session.getAttribute("logInMember"));
		
						System.out.println("현재회원 : " + logInMemberList);
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}

	private void memberSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		
		String	foundId = null;
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = null;
		
		try
		{
			memberVO = memberController.search("member_search", id);
			
			foundId = memberVO.getId();
		}
		catch(RuntimeException e)
		{

		}
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(foundId);
		writer.flush();
	}

	private void memberSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		MemberController	memberController = new MemberController();
		
		List<MemberVO>	memberList = memberController.searchAll("member_searchAll");
		
		request.setAttribute("memberList", memberList);
		request.getRequestDispatcher("testResult.jsp").forward(request, response);
	}

	@SuppressWarnings("unchecked")
	private void memberDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		
		String	sendMessage = "DELETE FINISHED";
		
		MemberController	memberController = new MemberController();
		
		memberController.delete("member_delete", id);
		
		HttpSession	session = request.getSession();
		
		List<MemberVO>	logInMemberList = (List<MemberVO>)getServletContext().getAttribute("logInMemberList");
		
		logInMemberList.remove(session.getAttribute("logInMember"));
		
		session.removeAttribute("logInMember");
		
						System.out.println("현재회원 : " + logInMemberList);
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}

	//////////////////////////////////////////////////// ContentsRequest ////////////////////////////////////////////////////

	private void contentsAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void contentsDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// TempRequest ////////////////////////////////////////////////////

	private void tempAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void tempDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// JoinedMemberRequest ////////////////////////////////////////////////////

	private void joinedmemberAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String	id = request.getParameter("memberId");
		String	docId = (String)getServletContext().getAttribute("docId");
		
		String	sendMessage = "Send Invite Message";
		
		MemberController	memberController = new MemberController();
		MemberVO	memberVO = null;
		
		memberVO = memberController.search("member_search", id);
			
		try
		{
			JoinedMemberController	joinedMemberController = new JoinedMemberController();
			JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();
			
			joinedMemberVO.setKey(docId + "/" + memberVO.getId());
			joinedMemberVO.setDocId(docId);
			joinedMemberVO.setFlag(1);
			joinedMemberVO.setMemberId(memberVO.getId());
			
			joinedMemberController.add("joinedMember_add", joinedMemberVO);
			
			List<JoinedMemberVO>	joinedMemberList = joinedMemberController.searchJoinedMember("joinedMember_searchAll", docId);
			
			getServletContext().setAttribute("joinedMemberList", joinedMemberList);
		}
		catch(RuntimeException e)
		{
			sendMessage = "Already Invited Member!";
		}

		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(sendMessage);
		writer.flush();
	}

	private void joinedmemberModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void joinedmemberDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	//////////////////////////////////////////////////// DockingEnvironmentRequest ////////////////////////////////////////////////////
	private void dockingEnvironmentAdd(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{	
		String	writerId = request.getParameter("writer");
		
		MemberVO	memberVO = new MemberController().search("member_search", writerId);
		
		DockingEnvironmentController	dockingEnvironmentController = new DockingEnvironmentController();
		DockingEnvironmentVO	dockingEnvironmentVO = new DockingEnvironmentVO();
		
		long 	time = System.currentTimeMillis(); 
		Date	date = new Date(time);
		
		dockingEnvironmentVO.setDocId(memberVO.getId() + "/" + time);
		dockingEnvironmentVO.setTitle(memberVO.getId());
		dockingEnvironmentVO.setCreationDate(date);
		dockingEnvironmentVO.setWriter(memberVO.getId());
		
		dockingEnvironmentController.add("dockingEnvironment_add", dockingEnvironmentVO);
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		JoinedMemberController	joinedMemberController = new JoinedMemberController();
		JoinedMemberVO	joinedMemberVO = new JoinedMemberVO();
		
		joinedMemberVO.setKey(dockingEnvironmentVO.getDocId() + "/" + memberVO.getId());
		joinedMemberVO.setDocId(dockingEnvironmentVO.getDocId());
		joinedMemberVO.setFlag(1);
		joinedMemberVO.setMemberId(memberVO.getId());
		
		joinedMemberController.add("joinedMember_add", joinedMemberVO);
		
		List<JoinedMemberVO>	joinedMemberList = joinedMemberController.searchJoinedMember("joinedMember_searchAll", dockingEnvironmentVO.getDocId());
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		getServletContext().setAttribute("docId", dockingEnvironmentVO.getDocId());
		getServletContext().setAttribute("joinedMemberList", joinedMemberList);
		getServletContext().setAttribute("masterId", memberVO.getId());
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		SocketIO	socketIO = (SocketIO)getServletContext().getAttribute("socketIO");
		
		int		portNum = -(int)time;
		portNum %= 51000;
		
		socketIO.setPort(portNum);
		socketIO.start(Vertx.newVertx());
		
		getServletContext().setAttribute("portNum", portNum);
		
		System.out.println(portNum);
		
		/////////////////////////////////////////////////////////////////////////////////////////////
		
		response.setCharacterEncoding("utf-8");
		PrintWriter	writer = response.getWriter();
		
		writer.println(dockingEnvironmentVO.getDocId());
		writer.flush();
	}

	private void dockingEnvironmentModify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentSearch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentSearchAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	private void dockingEnvironmentDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}
}
