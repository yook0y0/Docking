package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
		String confirmNo = this.createConfirmNo();
		
		String email = req.getParameter("emailInfo");
		
		this.sendConfirmNo(email, confirmNo);
		
		HttpSession session = req.getSession();
		
		synchronized (session) 
		{
			session.setAttribute("confirmCode", confirmNo);
		}
		
		req.setAttribute("email", email);
		
		String	sendMessage = "EMAIL CHECK!";
		
		res.setCharacterEncoding("utf-8");
		PrintWriter writer;
		try 
		{
			writer = res.getWriter();	
			writer.println(sendMessage);
			writer.flush();
		} 
		catch (IOException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		
		return true;
	}
	
	private String createConfirmNo()
	{
		int confirmCode = new Random().nextInt();
		return Integer.toString(Math.abs(confirmCode));
	}
	
	private String sendConfirmNo(String to, String confirmNo)
	{
		EmailSendable emailSender = new EmailSender();
		
		emailSender.setTo(to);
		emailSender.setFrom(to);
		emailSender.setSubject("Docking! 가입 확인메시지!");
		emailSender.setContent(confirmNo);
		emailSender.sendEmail();
		
		return confirmNo;
	}
}
