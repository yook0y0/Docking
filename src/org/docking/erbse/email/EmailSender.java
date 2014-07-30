package org.docking.erbse.email;

import javax.mail.MessagingException;

public class EmailSender implements EmailSendable{
	String from; // ë©”ì¼ ë³´ë‚´???¬ëŒ
	String to; // ë©”ì¼ ë³´ë‚¼?¬ëŒ
	/*String cc;*/     // ì°¸ì¡°
	String subject;// ?œëª©
	String content;// ?´ìš©
	/**
	  * @param args
	  */
	 public void sendEmail() {
	  if(from.trim().equals("")) {
		  System.out.println("ë³´ë‚´???¬ëŒ???…ë ¥?˜ì? ?Šì•˜?µë‹ˆ??");
	  }
	  else if(to.trim().equals("")) {
		  System.out.println("ë°›ëŠ” ?¬ëŒ???…ë ¥?˜ì? ?Šì•˜?µë‹ˆ??");
	  }
	  else {
		  try {
			  EmailUtil mt = new EmailUtil();
			  // ë©”ì¼ë³´ë‚´ê¸?
			  //mt.sendEmail(from, to, cc, subject, content);
			  mt.sendEmail(from, to, subject, content);
			  System.out.println("ë©”ì¼ ?„ì†¡???±ê³µ?˜ì??µë‹ˆ??	");
		  }catch(MessagingException me) {
			  System.out.println("ë©”ì¼ ?„ì†¡???¤íŒ¨?˜ì??µë‹ˆ??	");
			  System.out.println("?¤íŒ¨ ?´ìœ  : " + me.getMessage());
			  me.printStackTrace();
		  }catch(Exception e) {
			  System.out.println("ë©”ì¼ ?„ì†¡???¤íŒ¨?˜ì??µë‹ˆ??	");
			  System.out.println("?¤íŒ¨ ?´ìœ  : " + e.getMessage());
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
