package org.docking.erbse.email;


import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;

public class SMTPAuthenticator extends Authenticator {
	private String username; // gmail ?¬ìš©??
	private String password;  // ?¨ìŠ¤?Œë“œ;
	
	public SMTPAuthenticator() {
		username = "docking.d2fest@gmail.com";
		password = "89090909";
	}
	
	protected PasswordAuthentication getPasswordAuthentication() {
		return new PasswordAuthentication(username, password);
	}
}
