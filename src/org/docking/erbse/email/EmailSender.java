package org.docking.erbse.email;

import javax.mail.MessagingException;

public class EmailSender implements EmailSendable{
	String from; // ๋ฉ์ผ ๋ณด๋ด???ฌ๋
	String to; // ๋ฉ์ผ ๋ณด๋ผ?ฌ๋
	/*String cc;*/     // ์ฐธ์กฐ
	String subject;// ?๋ชฉ
	String content;// ?ด์ฉ
	/**
	  * @param args
	  */
	 public void sendEmail() {
	  if(from.trim().equals("")) {
		  System.out.println("๋ณด๋ด???ฌ๋???๋ ฅ?์? ?์?ต๋??");
	  }
	  else if(to.trim().equals("")) {
		  System.out.println("๋ฐ๋ ?ฌ๋???๋ ฅ?์? ?์?ต๋??");
	  }
	  else {
		  try {
			  EmailUtil mt = new EmailUtil();
			  // ๋ฉ์ผ๋ณด๋ด๊ธ?
			  //mt.sendEmail(from, to, cc, subject, content);
			  mt.sendEmail(from, to, subject, content);
			  System.out.println("๋ฉ์ผ ?์ก???ฑ๊ณต?์??ต๋??	");
		  }catch(MessagingException me) {
			  System.out.println("๋ฉ์ผ ?์ก???คํจ?์??ต๋??	");
			  System.out.println("?คํจ ?ด์  : " + me.getMessage());
			  me.printStackTrace();
		  }catch(Exception e) {
			  System.out.println("๋ฉ์ผ ?์ก???คํจ?์??ต๋??	");
			  System.out.println("?คํจ ?ด์  : " + e.getMessage());
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
