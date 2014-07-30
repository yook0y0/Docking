package org.docking.erbse.email;

import javax.mail.MessagingException;

public class EmailSender implements EmailSendable{
	String from; // 메일 보내는 사람
	String to; // 메일 보낼사람
	/*String cc;*/     // 참조
	String subject;// 제목
	String content;// 내용
	/**
	  * @param args
	  */
	 public void sendEmail() {
	  if(from.trim().equals("")) {
		  System.out.println("보내는 사람을 입력하지 않았습니다.");
	  }
	  else if(to.trim().equals("")) {
		  System.out.println("받는 사람을 입력하지 않았습니다.");
	  }
	  else {
		  try {
			  EmailUtil mt = new EmailUtil();
			  // 메일보내기
			  //mt.sendEmail(from, to, cc, subject, content);
			  mt.sendEmail(from, to, subject, content);
			  System.out.println("메일 전송에 성공하였습니다.	");
		  }catch(MessagingException me) {
			  System.out.println("메일 전송에 실패하였습니다.	");
			  System.out.println("실패 이유 : " + me.getMessage());
			  me.printStackTrace();
		  }catch(Exception e) {
			  System.out.println("메일 전송에 실패하였습니다.	");
			  System.out.println("실패 이유 : " + e.getMessage());
			  e.printStackTrace();
		  }
	  }
	}
	public void setContent(String content) {
		this.content = content;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public String toString() {
		return super.toString();
	}
}
