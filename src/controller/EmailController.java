package controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import util.Injector;
import vo.MemberContentsVO;
import vo.MemberVO;
import controller.action.SearchAction;

import analysis.attribute.Attr;

import email.EmailSendable;
import email.EmailSender;

public class EmailController 
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
	
	public boolean emailConfirm()
	{
		String 	memberId = req.getParameter("memberId");
		String	memberPw = req.getParameter("memberPw");
		String	memberNickName = req.getParameter("memberNickName");
		String	memberType = req.getParameter("memberType");
		
		String confirmNo = this.createConfirmNo(memberId,memberPw,memberNickName,memberType);
		
		this.sendConfirmNo(memberId, confirmNo, "Docking! 가입 확인메시지!");
		
		res.setCharacterEncoding("utf-8");
		
		PrintWriter writer = null;
		
		try 
		{
			writer = res.getWriter();	
			writer.println("Email Send Success");
			writer.flush();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	
		return true;
	}
	
	public void inviteEmail()	throws ServletException, IOException
	{
		String 	memberId = req.getParameter("memberId");
		String	docId = req.getParameter("docId");
		
		String	sendMessage = "1|Send Invite Email!";
		int		chk = 1;
		
		res.setCharacterEncoding("utf-8");
		
		PrintWriter writer = null;
		
		SearchAction	searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		MemberVO mvo = searchAction.searchMember(memberId);
		
		if(mvo == null){
			// 없는사람
		}
		
		MemberContentsVO mcvo = searchAction.searchMemberContents(mvo.getId());
		if(mcvo != null){
			chk = 0;
		}
		
		if(chk == 0)
		{
			sendMessage = "0|Already Invited Member!";
		}
		
		else
		{
			String confirmNo = this.createInviteMessage(memberId,docId);
			
			this.sendConfirmNo(memberId, confirmNo, docId + "의 초대메시지!");
		}
		
		try 
		{
			writer = res.getWriter();	
			writer.println(sendMessage);
			writer.flush();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	public void duplicationCheck()	throws ServletException, IOException
	{
		String	memberId = req.getParameter("memberId");
		String	sendMessage = "1|Possible Email!";
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		if(searchAction.searchMember(memberId) != null)
		{
			sendMessage = "0|Enter Another Email!";
		}
		
		PrintWriter writer = res.getWriter();	
		writer.println(sendMessage);
		writer.flush();
	}
	
	private String createConfirmNo(String memberId , String memberPw , String memberNickName , String memberType)
	{
		String	message = "해당 링크를 선택하면 회원가입이 완료됩니다!" + '\n' +
				Attr.WEB_SITE_ADDRESS + 
				"member_add?memberId=" + memberId + "&memberPw=" + memberPw + "&memberNickName=" + memberNickName + "&memberType=" + memberType;
		
		return message;
	}
	
	private String createInviteMessage(String memberId , String docId)
	{
		String	message = "해당 링크를 선택하면 초대가 수락됩니다!" + '\n' +
				Attr.WEB_SITE_ADDRESS + 
				"memberContents_add?memberId=" + memberId + "&docId=" + docId;
		
		return message;
	}
	
	private String sendConfirmNo(String to, String confirmNo, String subjectMessage)
	{
		EmailSendable emailSender = new EmailSender();
		
		emailSender.setTo(to);
		emailSender.setFrom(to);
		emailSender.setSubject(subjectMessage);
		emailSender.setContent(confirmNo);
		emailSender.sendEmail();
		
		return confirmNo;
	}
}
