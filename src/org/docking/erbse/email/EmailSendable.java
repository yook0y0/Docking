package org.docking.erbse.email;

public interface EmailSendable {
	public void setContent(String content);
	public void setContentType(String contentType);
	public void setFrom(String from);
	public void setSubject(String subject);
	public void setTo(String to);
	public void sendEmail();
}