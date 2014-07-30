package org.docking.erbse.email;


import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;

public class SMTPAuthenticator extends Authenticator {
	private String username; // gmail 사용자;
	private String password;  // 패스워드;
	
	public SMTPAuthenticator() {
		username = "docking.d2fest@gmail.com";
		password = "89090909";
	}
	
	protected PasswordAuthentication getPasswordAuthentication() {
		return new PasswordAuthentication(username, password);
	}
}
