package controller;


import java.util.Random;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import util.Injector;


import email.EmailSendable;

public class EmailConfirmController
{
	public HttpServletRequest httpServletRequest;
	
	public void EmailConfirmController()
	{
	
	}
	
	public void EmailConfirmController(HttpServletRequest httpServletRequest)
	{
		this.httpServletRequest = httpServletRequest;
	}
	
	public void setHttpServletRequest(HttpServletRequest httpServletRequest)
	{
		this.httpServletRequest = httpServletRequest;
	}
	
	public boolean emailConfirm()
	{
		String confirmNo = createConfirmNo();
		
		String email = httpServletRequest.getParameter("email");
		
		sendConfirmNo(email, confirmNo);
		
		HttpSession session = httpServletRequest.getSession();
		synchronized (session) {
			session.setAttribute("confirmCode", confirmNo);
		}
		
		httpServletRequest.setAttribute("email", email);
		
		return true;
	}
	
	private String createConfirmNo()
	{
		int confirmCode = new Random().nextInt();
		return Integer.toString(Math.abs(confirmCode));
	}
	
	private String sendConfirmNo(String to, String confirmNo)
	{
		EmailSendable emailSender = (EmailSendable)Injector.getInstance().getObject(EmailSendable.class);
		
		emailSender.setTo(to);
		emailSender.setFrom(to);
		emailSender.setSubject("인증코드 발송");
		emailSender.setContent(confirmNo);
		emailSender.sendEmail();
		
		return confirmNo;
	}
}
