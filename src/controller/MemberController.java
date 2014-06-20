package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import util.Injector;
import vo.MemberVO;
import controller.action.AddAction;
import controller.action.DeleteAction;
import controller.action.ModifyAction;
import controller.action.SearchAction;

public class MemberController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}
	
	public void memberAdd() throws ServletException, IOException
	{			
		String	id = req.getParameter("memberId");
		String	pw = req.getParameter("memberPw");
		String	nickName = req.getParameter("memberNickName");
		String	type = req.getParameter("memberType");

		HttpSession	session = null;

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		MemberVO	memberVO = new MemberVO();

		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));

		addAction.addMember(memberVO);

		session = req.getSession();
		session.setAttribute("logInMember", memberVO);
		
		res.sendRedirect("./start.jsp");
	}
	
	public void memberModify() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");
		String	pw = req.getParameter("memberPw");
		String	nickName = req.getParameter("memberNickName");
		String	type = req.getParameter("memberType");

		String	sendMessage = "MODIFY FINISHED";

		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		MemberVO	memberVO = new MemberVO();

		memberVO.setId(id);
		memberVO.setPw(pw);
		memberVO.setNickName(nickName);
		memberVO.setMemberType(Integer.parseInt(type));

		modifyAction.modifyMember(memberVO);

		HttpSession	session = req.getSession();

		session.setAttribute("logInMember", memberVO);

		res.setCharacterEncoding("utf-8");
		PrintWriter	writer = res.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}
	
	public void memberSearch() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");

		String	foundId = null;

		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		MemberVO	memberVO = null;

		try
		{
			memberVO = searchAction.searchMember(id);

			foundId = memberVO.getId();
		}
		catch(RuntimeException e)
		{

		}

		res.setCharacterEncoding("utf-8");
		PrintWriter	writer = res.getWriter();

		writer.println(foundId);
		writer.flush();
	}
	
	public void memberDelete() throws ServletException, IOException
	{
		String	id = req.getParameter("memberId");

		String	sendMessage = "DELETE FINISHED";

		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		
		deleteAction.deleteMember(id);

		HttpSession	session = req.getSession();

		session.removeAttribute("logInMember");

		res.setCharacterEncoding("utf-8");
		PrintWriter	writer = res.getWriter();

		writer.println(sendMessage);
		writer.flush();
	}
	
	public void memberSearchAll() throws ServletException, IOException
	{
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<MemberVO>	memberList = searchAction.searchAllMember();

		req.setAttribute("memberList", memberList);
		req.getRequestDispatcher("testResult.jsp").forward(req, res);
	}
}
