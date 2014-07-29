package kr.co.docking.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.service.MemberService;
import kr.co.docking.service.MemberServiceImpl;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.MemberVO;

public class MemberController {
	private HttpServletRequest req;
	private HttpServletResponse res;
	private MemberService ms;
	
	public MemberController(){
		this.req = null;
		this.res = null;
		this.ms = new MemberServiceImpl();
	}
	
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}

	public void setRes(HttpServletResponse res) {
		this.res = res;
	}

	public void memberAdd() throws IOException 
	{
		String memberId = req.getParameter("memberId");
		String pw = req.getParameter("pw");
		String memberName = req.getParameter("memberName");
		Integer type = Integer.valueOf(req.getParameter("type"));

		MemberVO   mvo = new MemberVO();
		mvo.setMemberId(memberId);
		mvo.setPw(pw);
		mvo.setMemberName(memberName);
		mvo.setType(type);
		
		Integer code = ms.memberAdd(mvo);

		req.getSession().setAttribute("loginMember", mvo);
		PrintWriter pWriter = res.getWriter();
		pWriter.write(code);
		pWriter.flush();
	}

	public void memberModify() throws IOException 
	{
		String memberId = req.getParameter("memberId");
		String pw = req.getParameter("pw");
		String memberName = req.getParameter("memberName");
		Integer type = Integer.valueOf(req.getParameter("type"));

		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		MemberVO   mvo = new MemberVO();

		mvo.setMemberId(memberId);
		mvo.setPw(pw);
		mvo.setMemberName(memberName);
		mvo.setType(type);
		
		Integer code = ms.memberModify(mvo);

		req.getSession().setAttribute("logInMember", mvo);
		PrintWriter pWriter = res.getWriter();
		pWriter.write(code);
		pWriter.flush();
	}

	public void memberSearch() throws IOException 
	{
		String  memberId = req.getParameter("memberId");

		String jRes = ms.memberSearch(memberId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void memberDelete() throws IOException {
		String memberId = req.getParameter("memberId");

		Integer code = ms.memberDelete(memberId);

		req.getSession().removeAttribute("logInMember");

		PrintWriter pw = res.getWriter();
		pw.println(code);
		pw.flush();
	}
}