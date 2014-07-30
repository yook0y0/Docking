package org.docking.erbse.email;

import java.util.Date;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EmailUtil {
	public void sendEmail(String from, String to, String subject, String content) throws Exception {
			  // Properties ?¤ì 
			  // ?ë¡?¼í° ê°??¸ì¤?´ì¤ ?ì±ê³?ê¸°ë³¸?¸ì(SMTP ?ë² ?¸ì¤??ì§? )
			  Properties props = new Properties();
			  
			  // G-Mail SMTP ?¬ì©??
			  props.put("mail.transport.protocol", "smtp");// ?ë¡? ì½ ?¤ì 
			  props.put("mail.smtp.host", "smtp.gmail.com");// gmail SMTP ?ë¹??ì£¼ì(?¸ì¤??
			  props.put("mail.smtp.port", "465");// gmail SMTP ?ë¹???¬í¸ ?¤ì 
			  // ë¡ê·¸??? ë Transport Layer Security(TLS)ë¥??¬ì©??ê²ì¸ì§??¤ì 
			  // gmail ?ì  tlsê°??ìê°??ëë¯?¡ ?´ë ê·¸ë§ ?í´??ê·¸ë§
			        props.put("mail.smtp.starttls.enable","true");
			        // gmail ?¸ì¦??Secure Socket Layer(SSL) ?¤ì 
			        // gmail ?ì ?¸ì¦???¬ì©?´ì£¼ë¯?¡ ?ê±´ ?í´ì£¼ë©´ ?ë¨
			        props.setProperty("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
			        // props.put("mail.smtp.user", from);
			        props.put("mail.smtp.auth", "true");// SMTP ?¸ì¦???¤ì 
			        /**
			         * SMTP ?¸ì¦???ì??ê²½ì° ë°ë??Properties ??SMTP ?¸ì¦???¬ì©?ë¤ê³??¤ì ?ì¬???ë¤.
			         * ê·¸ë ì§??ì¼ë©??¸ì¦???ëì¡°ì°¨ ?ì? ?ë??
			         * ê·¸ë¦¬ê³?Authenticator ?´ë?¤ë? ?ìë°ì? SMTPAuthenticator ?´ë?¤ë? ?ì±?ë¤.
			         * getPasswordAuthentication() ë©ì?ë§ override ?ë©´ ?ë¤.
			         * ë¨??¬ì¤ ?¤ë¥¸ ë©ì?ë final ë©ì?ì¬??override ????ì¡°ì°¨ ?ë¤. -??;
			         */
			  Authenticator auth = new SMTPAuthenticator();
			  Session mailSession = Session.getDefaultInstance(props, auth);
			  
			// create a message
			  Message msg = new MimeMessage(mailSession);
			  
			  // set the from and to address
			  msg.setFrom(new InternetAddress(from));//ë³´ë´???¬ë ?¤ì 
			  msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));//ë°ë ?¬ë?¤ì 
			  
			 /* if(!cc.trim().equals("")) {
			   msg.setRecipients(Message.RecipientType.CC, InternetAddress.parse(cc, false));
			  }*/
			  
			  // Setting the Subject and Content Type
			  msg.setSubject(subject); // ?ëª© ?¤ì 
			  msg.setText(content);  // ?´ì© ?¤ì 
			  msg.setSentDate(new Date());// ë³´ë´??? ì§ ?¤ì 
			  
			  Transport.send(msg);  // ë©ì¼ ë³´ë´ê¸?
	}
}
