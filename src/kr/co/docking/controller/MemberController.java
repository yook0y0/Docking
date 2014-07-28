package kr.co.docking.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.MemberVO;

public class MemberController {
	private HttpServletRequest req;
	private HttpServletResponse res;
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}

	public void setRes(HttpServletResponse res) {
		this.res = res;
	}

	public void memberCreate() throws IOException {
		String memberId = req.getParameter("memberId");
		String pw = req.getParameter("pw");
		String memberName = req.getParameter("memberName");
		Integer type = Integer.valueOf(req.getParameter("type"));

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		MemberVO   mvo = new MemberVO();

		mvo.setMemberId(memberId);
		mvo.setPw(pw);
		mvo.setMemberName(memberName);
		mvo.setType(type);

		addAction.memberAdd(mvo);

		req.getSession().setAttribute("loginMember", mvo);
		PrintWriter pWriter = res.getWriter();
		pWriter.write("memberCreate");
		pWriter.flush();
	}

	public void memberUpdate() throws IOException {
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
		
		modifyAction.memberModify(mvo);

		req.getSession().setAttribute("logInMember", mvo);

		res.setCharacterEncoding("utf-8");
		PrintWriter   writer = res.getWriter();
		writer.write("memberUpdate");
		writer.flush();
	}

	public void memberRead() throws IOException {

		String   memberId = req.getParameter("memberId");

		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		MemberVO mvo = searchAction.memberSearch(memberId);

		PrintWriter   pw = res.getWriter();
		/*
		 * MemberVO 쏴줘야할듯
		 */
		pw.write("memberRead");
		pw.flush();
	}

	public void memberReadAll() throws IOException, ServletException {
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<MemberVO> memberList = searchAction.memberSearchAll();

		PrintWriter pw = res.getWriter();
		
		pw.write("memberReadAll");
		/*
		 * MemberVO List 타입 보내야할듯
		 */
		pw.flush();
	}

	public void memberReadAllByKey() { /*나중의 확장성을 위해 만들어만 놓음.*/}

	public void memberDelete() throws IOException {
		String memberId = req.getParameter("memberId");

		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.memberDelete(memberId);

		req.getSession().removeAttribute("logInMember");

		PrintWriter pw = res.getWriter();
		pw.println("memberDelete");
		pw.flush();
	}

	public void memberDeleteAll() {/*나중의 확장성을 위해 만들어만 놓음.*/}
}