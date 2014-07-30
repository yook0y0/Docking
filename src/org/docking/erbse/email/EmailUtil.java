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
			  // Properties ?¤ì •
			  // ?„ë¡œ?¼í‹° ê°??¸ìŠ¤?´ìŠ¤ ?ì„±ê³?ê¸°ë³¸?¸ì…˜(SMTP ?œë²„ ?¸ìŠ¤??ì§? •)
			  Properties props = new Properties();
			  
			  // G-Mail SMTP ?¬ìš©??
			  props.put("mail.transport.protocol", "smtp");// ?„ë¡œ? ì½œ ?¤ì •
			  props.put("mail.smtp.host", "smtp.gmail.com");// gmail SMTP ?œë¹„??ì£¼ì†Œ(?¸ìŠ¤??
			  props.put("mail.smtp.port", "465");// gmail SMTP ?œë¹„???¬íŠ¸ ?¤ì •
			  // ë¡œê·¸??? ë•Œ Transport Layer Security(TLS)ë¥??¬ìš©??ê²ƒì¸ì§??¤ì •
			  // gmail ?ì„  tlsê°??„ìˆ˜ê°??„ë‹ˆë¯?¡œ ?´ë„ ê·¸ë§Œ ?ˆí•´??ê·¸ë§Œ
			        props.put("mail.smtp.starttls.enable","true");
			        // gmail ?¸ì¦??Secure Socket Layer(SSL) ?¤ì •
			        // gmail ?ì„œ ?¸ì¦???¬ìš©?´ì£¼ë¯?¡œ ?”ê±´ ?ˆí•´ì£¼ë©´ ?ˆë¨
			        props.setProperty("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
			        // props.put("mail.smtp.user", from);
			        props.put("mail.smtp.auth", "true");// SMTP ?¸ì¦???¤ì •
			        /**
			         * SMTP ?¸ì¦???„ìš”??ê²½ìš° ë°˜ë“œ??Properties ??SMTP ?¸ì¦???¬ìš©?œë‹¤ê³??¤ì •?˜ì—¬???œë‹¤.
			         * ê·¸ë ‡ì§??Šìœ¼ë©??¸ì¦???œë„ì¡°ì°¨ ?˜ì? ?ŠëŠ”??
			         * ê·¸ë¦¬ê³?Authenticator ?´ë˜?¤ë? ?ì†ë°›ì? SMTPAuthenticator ?´ë˜?¤ë? ?ì„±?œë‹¤.
			         * getPasswordAuthentication() ë©”ì†Œ?œë§Œ override ?˜ë©´ ?œë‹¤.
			         * ë¨??¬ì‹¤ ?¤ë¥¸ ë©”ì†Œ?œëŠ” final ë©”ì†Œ?œì—¬??override ????ì¡°ì°¨ ?†ë‹¤. -??;
			         */
			  Authenticator auth = new SMTPAuthenticator();
			  Session mailSession = Session.getDefaultInstance(props, auth);
			  
			// create a message
			  Message msg = new MimeMessage(mailSession);
			  
			  // set the from and to address
			  msg.setFrom(new InternetAddress(from));//ë³´ë‚´???¬ëŒ ?¤ì •
			  msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));//ë°›ëŠ” ?¬ëŒ?¤ì •
			  
			 /* if(!cc.trim().equals("")) {
			   msg.setRecipients(Message.RecipientType.CC, InternetAddress.parse(cc, false));
			  }*/
			  
			  // Setting the Subject and Content Type
			  msg.setSubject(subject); // ?œëª© ?¤ì •
			  msg.setText(content);  // ?´ìš© ?¤ì •
			  msg.setSentDate(new Date());// ë³´ë‚´??? ì§œ ?¤ì •
			  
			  Transport.send(msg);  // ë©”ì¼ ë³´ë‚´ê¸?
	}
}
