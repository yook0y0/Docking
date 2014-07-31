package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.MemberService;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.Injector;
import org.docking.erbse.vo.MemberVO;


public class MemberController 
{
   private HttpServletRequest req;
   private HttpServletResponse res;
   private MemberService ms;
   
   public MemberController(){
      this.req = null;
      this.res = null;
      this.ms = (MemberService)Injector.getInstance().getObject(MemberService.class);
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
      String msg = null;
      if(code == 1){msg = GlobalVariable.MEMBER_SUCCESS;}
      else{msg = GlobalVariable.MEMBER_FAIL;};

      PrintWriter pWriter = res.getWriter();
      pWriter.write(msg);
      pWriter.flush();
   }

   public void memberModify() throws IOException 
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
      
      Integer code = ms.memberModify(mvo);
      
      String msg = null;
      if(code == 1){msg = GlobalVariable.MEMBER_SUCCESS;}
      else{msg = GlobalVariable.MEMBER_FAIL;};

      req.getSession().setAttribute("logInMember", mvo);
      PrintWriter pWriter = res.getWriter();
      pWriter.write(msg);
      pWriter.flush();
   }

   public void memberSearch() throws IOException 
   {
      String jRes = ms.memberSearch((MemberVO)req.getSession().getAttribute("logInMember"));
      
      PrintWriter pw = res.getWriter();
      pw.write(jRes);
      pw.flush();
   }
   
   public void memberDelete() throws IOException 
   {
      String memberId = req.getParameter("memberId");

      Integer code = ms.memberDelete(memberId);

      String msg = null;
      if(code == 1){msg = GlobalVariable.MEMBER_SUCCESS;}
      else{msg = GlobalVariable.MEMBER_FAIL;};
      
      req.getSession().removeAttribute("logInMember");

      PrintWriter pw = res.getWriter();
      pw.println(msg);
      pw.flush();
   }
   
   public void memberAddChk() throws IOException 
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

      Integer code = ms.memberAddChk(mvo);

      if(code == 1)
      {
         req.getSession().setAttribute("loginMember", mvo);
      }   

      try 
      {
         req.getRequestDispatcher("start.jsp").forward(req, res);
      } 
      catch (ServletException e) 
      {
         e.printStackTrace();
      }
   }
   
   public void memberLogin()   throws IOException
   {
      String   memberId = req.getParameter("memberId");
      
      Integer   code =    ms.memberLogin(memberId,req.getParameter("pw"));
      
      if(code == 1)
      {
         req.getSession().setAttribute("logInMember", ms.memberSearch(memberId));
      }
      
      PrintWriter   pw = res.getWriter();
      pw.print(code.toString());      
      pw.flush();
   }
   
   public void memberLogout()   throws IOException
   {
      req.getSession().removeAttribute("logInMember");

      res.sendRedirect("./start.jsp");
   }
}